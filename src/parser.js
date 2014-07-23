/**
 * Created by Eran_Amar on 7/20/14.
 */
function Parser() {
}

function safeRemoveQuatations(str) {
    var match = /^\s*"([^"]*)"\s*$/.exec(str);
    return match ? match[1] : str;
}

var CONVERTER_FUNCS = {
    'number': {
        'convertFunc': Number,
        "diagnoser": function (val) {
            return !isNaN(val);
        }
    },
    'string': {
        'convertFunc': safeRemoveQuatations,
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

function parseValueFromString(str) {
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
    var block = this.str.split(',', 2)[0];
    var hasFollowingComma = true;
    if (block.charAt(block.length-1) === '}'){
        block = block.slice(0, block.length - 1);
        hasFollowingComma = false;
    }
    var removedChars = hasFollowingComma? block.length+1 : block.length;
    this.str = this.str.slice(removedChars).trim();
    return block;
};

InputContainer.prototype.peekFirstChar = function peekFirstChar() {
    return this.str.charAt(0);
};

InputContainer.prototype.removeFirstChar = function peekFirstChar() {
    this.str = this.str.slice(1);
};

InputContainer.prototype.getLength = function getLength() {
    return this.str.length;
};

InputContainer.prototype.pushToHead = function pushToHead(str) {
    this.str = str + this.str;
};
InputContainer.prototype.assertNextCharThenPop = function assertNextCharThenPop(expectedToken) {
    if (this.peekFirstChar() !== expectedToken) {
        throw new Error('missing token: '+ expectedToken);
    }
    this.removeFirstChar();
};

Parser.prototype.parse = function parse(str) {
    var retObj = {};
    var inputData = new InputContainer(str);
    inputData.assertNextCharThenPop('{');

    while (inputData.getLength() > 1) {
        var block = inputData.extractNextBlock();
        var tokensArr = block.split(':', 2);
        var key = safeRemoveQuatations(tokensArr[0]),
            val = parseValueFromString(tokensArr[1]);
        retObj[key] = val;
    }

    inputData.assertNextCharThenPop('}');
    return retObj;
};