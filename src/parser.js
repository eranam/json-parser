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
    'closeObject': '}',
    'openArray': '[',
    'closeArray': ']'
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

function extractToken(str) {
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
    var match = extractToken(this.str);
    this.str = this.str.slice(String(match.value).length).trim();
    return match;
};

Tokenizer.prototype.getLength = function getLength() {
    return this.str.length;
};

Tokenizer.prototype.isReachCloseObject = function isReachCloseObject() {
    return startWith(this.str, SPECIAL_CHARS.closeObject);
};

Tokenizer.prototype.isReachCloseArray = function isReachCloseObject() {
    return startWith(this.str, SPECIAL_CHARS.closeArray);
};

function assertTokens(token, expectedValue) {
    if (token.value !== expectedValue) {
        throw new Error('missing token: ' + expectedValue + ' instead of:' + token.value);
    }
}

function handleStringValueOfTokenSafely(token) {
    if (token.type === 'string') {
        token.value = assertStringAndRemoveQuotations(token.value);
    }
    return token.value;
}

function isOpenArrayToken(token) {
    return token.value === SPECIAL_CHARS.openArray;
}

function isOpenObjectToken(token) {
    return token.value === SPECIAL_CHARS.openObject;
}

function parseArray(tokenizer) {
    var retVal = [];
    if (tokenizer.isReachCloseArray()) {
        tokenizer.extractNextToken();
        return retVal;
    }
    while (!tokenizer.isReachCloseArray()) {
        retVal.push(parseValue(tokenizer));
        if (!tokenizer.isReachCloseArray()) {
            assertTokens(tokenizer.extractNextToken(), SPECIAL_CHARS.comma);
        }
    }
    assertTokens(tokenizer.extractNextToken(), SPECIAL_CHARS.closeArray);
    return retVal;
}

function parseValue(tokenizer) {
    var token = tokenizer.extractNextToken(), retVal;
    if (isOpenArrayToken(token)) {
        retVal = parseArray(tokenizer);
    }
    else if (isOpenObjectToken(token)) {
        retVal = parseObject(tokenizer);
    }
    else {
        retVal = handleStringValueOfTokenSafely(token);
    }
    return retVal;
}

function parseObject(tokenizer) {
    var retObj = {};
    if (tokenizer.isReachCloseObject()) {
        tokenizer.extractNextToken();
        return retObj;
    }
    while (tokenizer.getLength() && !tokenizer.isReachCloseObject()) {
        var keyStrWithoutQuotations = assertStringAndRemoveQuotations(tokenizer.extractNextToken().value);
        assertTokens(tokenizer.extractNextToken(), SPECIAL_CHARS.seperator);
        retObj[keyStrWithoutQuotations] = parseValue(tokenizer);
        if (!tokenizer.isReachCloseObject()) {
            assertTokens(tokenizer.extractNextToken(), SPECIAL_CHARS.comma);
        }
    }
    if (!tokenizer.getLength()) {
        throw new Error('missing token: }');
    }
    assertTokens(tokenizer.extractNextToken(), SPECIAL_CHARS.closeObject);
    return retObj;
}

Parser.prototype.parse = function parse(str) {
    var tokenizer = new Tokenizer(str);
    assertTokens(tokenizer.extractNextToken(), SPECIAL_CHARS.openObject);
    return parseObject(tokenizer);
};

function getClass(obj) {
    var classStr = Object.prototype.toString.call(obj);
    return classStr.slice(8, classStr.length - 1);
}

function stringifyObj(obj, convertFunc){
    var retVal = '';
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            retVal += convertFunc(prop, obj[prop]) + ',';
        }
    }
    if (endsWith(retVal, ',')) {
        retVal = retVal.slice(0, retVal.length - 1);
    }
    return retVal;
}
function convertObjectToString(obj){
    function objPrintFuc(key, value){
        return '"' + key + '"' + ':' + convertValueToString(value);
    }
    return '{' + stringifyObj(obj, objPrintFuc) + '}';
}

function convertArrayToString(arr){
    function arrPrintFunc(key, value){
        return convertValueToString(value);
    }
    return '[' + stringifyObj(arr, arrPrintFunc) + ']';
}

function convertValueToString(value) {
    switch (getClass(value)) {
        case 'String':
            return '"' + value + '"';
        case 'Array':
            return convertArrayToString(value);
        default :
            return String(value);
    }
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

Parser.prototype.print = function print(obj) {
    return convertObjectToString(obj);
};