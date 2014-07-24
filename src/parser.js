/**
 * Created by Eran_Amar on 7/20/14.
 */
function Parser() {
}

function assertStringAndRemoveQuotations(str) {
    if (!TOKENS_TYPES.string.diagnoser(str)) {
        throw new Error('Missing double quotations in token that should be string: ' + str);
    }
    var content = TOKENS_TYPES.string.extractFunc(str);
    return content.slice(1, content.length - 1);
}

var SPECIAL_CHARS = {
    'comma': ',',
    'seperator': ':',
    'openObject': '{',
    'closeObject': '}'
};

function startWith(wholeStr, prefix) {
    return wholeStr.indexOf(prefix) == 0;
}

function findSpecialCharType(str) {
    for (var type in SPECIAL_CHARS) {
        if (SPECIAL_CHARS.hasOwnProperty(type) && startWith(str, SPECIAL_CHARS[type])) {
            return type
        }
    }
    return undefined;
}

function identity(x) {
    return x;
}

function genTypeFromRegex(regex, modifierFunc) {
    modifierFunc = modifierFunc ? modifierFunc : identity;
    return {
        'extractFunc': function (val) {
            return modifierFunc(regex.exec(val)[0]);
        },
        'diagnoser': function (val) {
            return regex.test(val);
        }
    };
}

var TOKENS_TYPES = {
    'number': genTypeFromRegex(/^-?\d+(\.\d*)?/, Number),
    'string': genTypeFromRegex(/^"([^"]*)"/),
    'boolean': genTypeFromRegex(/^(true|false)/, function (matchStr) {
        return matchStr === 'true';
    }),
    'null': genTypeFromRegex(/^null/, function () {
        return null;
    }),
    'specialChar': {
        "extractFunc": function (val) {
            return SPECIAL_CHARS[findSpecialCharType(val)];
        },
        'diagnoser': function (val) {
            return !!findSpecialCharType(val)
        }
    }
};

function parseToken(str) {
    for (var type in TOKENS_TYPES) {
        if (TOKENS_TYPES.hasOwnProperty(type) && TOKENS_TYPES[type].diagnoser(str)) {
            return {
                'type': type,
                'value': TOKENS_TYPES[type].extractFunc(str)
            };
        }
    }
    throw new Error('unrecognized next token in: ' + str);
}

function Tokenizer(str) {
    this.str = str.trim();
}

Tokenizer.prototype.extractNextToken = function extractNextToken() {
    var match = parseToken(this.str);
    this.str = this.str.slice(String(match.value).length).trim();
    return match;
};

Tokenizer.prototype.getLength = function getLength() {
    return this.str.length;
};

function assertTokens(token, expectedValue) {
    if (token.value !== expectedValue) {
        throw new Error('missing token: ' + expectedValue);
    }
}

function handleStringValueSafely(token) {
    if (token.type === 'string') {
        token.value = assertStringAndRemoveQuotations(token.value);
    }
}

function parseObject(tokenizer){
    var retObj = {};
    assertTokens(tokenizer.extractNextToken(), SPECIAL_CHARS.openObject);
    while (tokenizer.getLength() > 1) {
        var keyStrWithoutQuotations = assertStringAndRemoveQuotations(tokenizer.extractNextToken().value);
        assertTokens(tokenizer.extractNextToken(), SPECIAL_CHARS.seperator);
        var valToken = tokenizer.extractNextToken();
        handleStringValueSafely(valToken);
        retObj[keyStrWithoutQuotations] = valToken.value;
        if (tokenizer.getLength() > 1) {
            assertTokens(tokenizer.extractNextToken(), SPECIAL_CHARS.comma);
        }
    }

    if (!tokenizer.getLength()) {
        throw new Error('missing token: ' + SPECIAL_CHARS.closeObject);
    } else {
        assertTokens(tokenizer.extractNextToken(), SPECIAL_CHARS.closeObject);
    }
    return retObj;
}

Parser.prototype.parse = function parse(str) {
    var tokenizer = new Tokenizer(str);
    return parseObject(tokenizer);
};