/**
 * Created by Eran_Amar on 7/20/14.
 */
function Parser() {
}

Parser.prototype.parse = function parse(str) {
    var retObj = {};
    if (str.length > 2) {
        str = str.slice(1, str.length - 1);
        var tokensArr = str.split(':');
        var key = tokensArr[0],
            val = tokensArr[1];
        if (/^"[^"]*"$/.test(key)) {
            key = key.slice(1, key.length - 1);
        }
        if (!isNaN(val)) {
            val = Number(val);
        }
        retObj[key] = val;
    }
    return retObj;
};