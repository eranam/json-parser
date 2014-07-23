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

function extractValueFromString(data) {
    for (var type in CONVERTER_FUNCS) {
        if (CONVERTER_FUNCS.hasOwnProperty(type) && CONVERTER_FUNCS[type].diagnoser(data)) {
            return CONVERTER_FUNCS[type].convertFunc(data);

        }
    }
    return data;
}

Parser.prototype.parse = function parse(str) {
    var retObj = {};
    if (str.charAt(0) !== '{'){
        throw new Error('missing token: {')
    }
    str = str.slice(1);
    if (str.length > 2) {
        while (str.length > 1) {
            var block = str.split(',', 2)[0];
            var lastChar = block.charAt(block.length - 1);
            console.log(block);
            if (lastChar === '}'){
                block = block.slice(0, block.length -1);
                str = '1'+str;
                console.log("CUTTING: "+block);
            } else if (lastChar === ','){

            }
            var tokensArr = block.split(':', 2);
            var key = safeRemoveQuatations(tokensArr[0]),
                val = safeRemoveQuatations(tokensArr[1]);
            retObj[key] = extractValueFromString(val);
            str = str.slice(block.length+1).trim();
        }
    }
    if (str.charAt(0) !== '}'){
        throw new Error('missing token: }')
    }
    return retObj;
};