/**
 * Created by Eran_Amar on 7/20/14.
 */

function Parser() {
}

Parser.prototype.parse = function parse(str) {
    var tokenizer = new Tokenizer(str);
    assertToken(TOKENS_TYPES.objectOpened, tokenizer.getNextToken());
    return parseObject(tokenizer);
};

function parseObject(tokenizer) {
    var retObj = {};
    while (!isNextTokenClosedObject(tokenizer) && tokenizer.hasNext()) {
        var keyStr = tokenizer.getNextToken().value.toString();
        retObj[keyStr] = parseValue(tokenizer);
    }
    if (tokenizer.hasNext()) {
        assertToken(TOKENS_TYPES.objectClosed, tokenizer.getNextToken());
    } else {
        throw new Error('Missing "}" at the end of object');
    }
    return retObj;
}

function parseValue(tokenizer) {
    assertToken(TOKENS_TYPES.separator, tokenizer.getNextToken());
    var token = tokenizer.getNextToken().value, retVal;
    if (TOKENS_TYPES.objectOpened.test(token)) {
        retVal = parseObject(tokenizer);
    } else {
        retVal = token;
    }
    if (tokenizer.hasNext() && !isNextTokenClosedObject(tokenizer)) {
        assertToken(TOKENS_TYPES.comma, tokenizer.getNextToken());
    }
    return retVal;
}

function TokenType(regex, toValueFunc) {
    this.regex = regex;
    this.convertFunc = toValueFunc;
}
TokenType.prototype.firstMatch = function firstMatch(str) {
    var match = this.regex.exec(str);
    return match[0];
};
TokenType.prototype.test = function test(str) {
    return this.regex.test(str);
};
TokenType.prototype.toValue = function toValue(str) {
    return this.convertFunc(str);
};
TokenType.prototype.toString = function toString() {
    var regexStr = this.regex.toString();
    return '"' + regexStr.slice(2, regexStr.length - 1) + '"';
};

var TOKENS_TYPES = {
    'number': new TokenType(/^-?\d+(\.\d*)?/, Number),
    'objectOpened': new TokenType(/^\{/, function () {
        return '{';
    }),
    'objectClosed': new TokenType(/^\}/, function () {
        return '}';
    }),
    'separator': new TokenType(/^:/, function () {
        return ':';
    }),
    'comma': new TokenType(/^,/, function () {
        return ',';
    }),
    'string': new TokenType(/^"[^"]*"/, function (str) {
        return str.slice(1, str.length - 1);
    }),
    'boolean': new TokenType(/^(true|false)/, function (str) {
        return str == "true";
    }),
    'null': new TokenType(/^null/, function () {
        return null;
    })
};

function isNextTokenClosedObject(tokenizer) {
    return TOKENS_TYPES.objectClosed.test(tokenizer.str);
}

function assertToken(tokenType, token) {
    if (!tokenType.test(token.str)) {
        throw new Error('Can\'t match ' + tokenType + ' in the beginning of: ' + token.str);
    }
}

function Tokenizer(str) {
    this.str = str.trim();
}

function matchTokenTypeName(str) {
    for (var tokenName in TOKENS_TYPES) {
        if (TOKENS_TYPES.hasOwnProperty(tokenName)) {
            if (TOKENS_TYPES[tokenName].test(str)) {
                return tokenName;
            }
        }
    }
    return undefined;
}

Tokenizer.prototype.getNextToken = function getNextToken() {
    var tokenTypeName = matchTokenTypeName(this.str);
    if (!tokenTypeName) {
        throw new Error('Can\'t find next token in: ' + this.str);
    }
    var token = TOKENS_TYPES[tokenTypeName].firstMatch(this.str);
    this.str = this.str.slice(token.length).trim();
    var tokenStr = token.trim();
    return {
        'str': tokenStr,
        'type': tokenTypeName,
        'value': TOKENS_TYPES[tokenTypeName].toValue(tokenStr)
    }
};

Tokenizer.prototype.hasNext = function hasNext() {
    return this.str.length > 0;
};

