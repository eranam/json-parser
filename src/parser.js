/**
 * Created by Eran_Amar on 7/20/14.
 */
function Parser() {
}

function assertStringAndRemoveQuotations(str) {
    if (!CONVERTER_FUNCS.string.diagnoser(str)) {
        throw new Error('Missing double quotations in token that should be string: ' + str);
    }
    var content = CONVERTER_FUNCS.string.extractFunc(str);
    return content.slice(1, content.length-1);
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

var CONVERTER_FUNCS = {
    'number': {
        "extractFunc": Number,
        'diagnoser': function (val) {
            return !isNaN(val);
        }
    },
    'string': {
        "extractFunc": function (val) {
            return /^"([^"]*)"/.exec(val)[0];
        },
        'diagnoser': function (val) {
            return /^\s*"([^"]*)"\s*$/.test(val);
        }
    },
    'boolean': {
        "extractFunc": function (val) {
            return val == 'true';
        },
        "diagnoser": function (val) {
            return /^(true|false)/.test(val);
        }
    },
    'null': {
        "extractFunc": function () {
            return null;
        },
        "diagnoser": function (val) {
            return /^null/.test(val)
        }
    },
    'specialChar': {
        "extractFunc": function (val) {
            var type = findSpecialCharType(val);
            return SPECIAL_CHARS[type];
        },
        'diagnoser': function (val) {
            return !!findSpecialCharType(val)
        }
    }
};

function parseToken(str) {
    for (var type in CONVERTER_FUNCS) {
        if (CONVERTER_FUNCS.hasOwnProperty(type) && CONVERTER_FUNCS[type].diagnoser(str)) {
            return {
                'type': type,
                'value':CONVERTER_FUNCS[type].extractFunc(str)
            };
        }
    }
    throw new Error('unrecognized next token in: ' + str);
}

function InputContainer(str) {
    this.str = str;
}

InputContainer.prototype.extractNextToken = function extractNextToken() {
    var match = parseToken(this.str);
    this.str = this.str.slice(match.value.length).trim();
    return match;
};

InputContainer.prototype.extractNextBlock = function extractNextBlock() {
    var block = this.str.split(SPECIAL_CHARS.comma, 2)[0];
    var hasFollowingComma = true;
    if (block.charAt(block.length - 1) === SPECIAL_CHARS.closeObject) {
        block = block.slice(0, block.length - 1);
        hasFollowingComma = false;
    }
    var removedChars = hasFollowingComma ? block.length + 1 : block.length;
    this.str = this.str.slice(removedChars).trim();
    var tokensArr = block.split(':', 2);
    return {
        'key': tokensArr[0].trim(),
        'value': tokensArr[1].trim()
    };
};

InputContainer.prototype.getLength = function getLength() {
    return this.str.length;
};

InputContainer.prototype.assertNextTokenThenPop = function assertNextCharThenPop(expectedToken) {
    var nextToken = this.extractNextToken();
    if (nextToken.value !== expectedToken) {
        throw new Error('missing token: ' + expectedToken);
    }
};

Parser.prototype.parse = function parse(str) {
    var retObj = {};
    var inputData = new InputContainer(str);
    inputData.assertNextTokenThenPop(SPECIAL_CHARS.openObject);
    while (inputData.getLength() > 1) {
        var block = inputData.extractNextBlock();
        var key = assertStringAndRemoveQuotations(block.key);
        var val = parseToken(block.value);
        if (val.type === 'string'){
            val.value = assertStringAndRemoveQuotations(val.value);
        }
        retObj[key] = val.value;
    }
    inputData.assertNextTokenThenPop(SPECIAL_CHARS.closeObject);
    return retObj;
};