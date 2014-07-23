/**
 * Created by Eran_Amar on 7/20/14.
 */
function Parser() {
}
function safeRemoveQuatations(str){
    var match = /^\s*"([^"]*)"\s*$/.exec(str);
    return match ? match[1] : str;
}

Parser.prototype.parse = function parse(str) {
    var retObj = {};
    if (str.length > 2) {
        str = str.slice(1, str.length - 1);
        while(str.length) {
            var block = str.split(',', 2)[0];
            var tokensArr = block.split(':', 2);
            var key = safeRemoveQuatations(tokensArr[0]),
                val = safeRemoveQuatations(tokensArr[1]);
            if (!isNaN(val)) {
                val = Number(val);
            } else if (/^(true|false)/.test(val)){
                val = (val == 'true');
            }
            retObj[key] = val;
            str = str.slice(block.length+1).trim();
        }
    }
    return retObj;
};