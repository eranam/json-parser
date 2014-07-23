/**
 * Created by Eran_Amar on 7/20/14.
 */
function Parser() {
}

function assertAndRemoveQuotations(str) {
    if (!CONVERTER_FUNCS.string.diagnoser(str)) {
        throw new Error('Missing double quotations in next token: ' + str);
    }
    return CONVERTER_FUNCS.string.convertFunc(str);
}

var SPECIAL_CHARS = {
    'comma': ',',
    'seperator': ':',
    'openObject': '{',
    'closeObject': '}'
};

var CONVERTER_FUNCS = {
    'number': {
        'convertFunc': Number,
        "diagnoser": function (val) {
            return !isNaN(val);
        }
    },
    'string': {
        'convertFunc': function (val) {
            return /^\s*"([^"]*)"\s*$/.exec(val)[1];
        },
        "diagnoser": function (val) {
            return /^\s*"([^"]*)"\s*$/.test(val);
        }
    },
    'boolean': {
        'convertFunc': function (val) {
            return val == 'true';
        },
        "diagnoser": function (val) {
            return /^(true|false)/.test(val);
        }
    },
    'null': {
        'convertFunc': function () {
            return null;
        },
        "diagnoser": function (val) {
            return /^null/.test(val)
        }
    }
};

function parseValue(str) {
    str = str.trim();
    for (var type in CONVERTER_FUNCS) {
        if (CONVERTER_FUNCS.hasOwnProperty(type) && CONVERTER_FUNCS[type].diagnoser(str)) {
            return CONVERTER_FUNCS[type].convertFunc(str);
        }
    }
    throw new Error('unrecognized next token in: ' + str);
}

function InputContainer(str) {
    this.str = str;
}

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

InputContainer.prototype.assertNextCharThenPop = function assertNextCharThenPop(expectedToken) {
    if (this.str.charAt(0) !== expectedToken) {
        throw new Error('missing token: ' + expectedToken);
    }
    this.str = this.str.slice(1);
};

Parser.prototype.parse = function parse(str) {
    var retObj = {};
    var inputData = new InputContainer(str);
    inputData.assertNextCharThenPop(SPECIAL_CHARS.openObject);
    while (inputData.getLength() > 1) {
        var block = inputData.extractNextBlock();
        var key = assertAndRemoveQuotations(block.key);
        retObj[key] = parseValue(block.value);
    }
    inputData.assertNextCharThenPop(SPECIAL_CHARS.closeObject);
    return retObj;
};