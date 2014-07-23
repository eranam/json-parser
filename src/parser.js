/**
 * Created by Eran_Amar on 7/20/14.
 */
function Parser() {
}

Parser.prototype.parse = function parse(str) {
    var retObj = {};
    if (str.length > 2) {
        str = str.slice(1, str.length - 1);
        while(str.length) {
            var block = str.split(',', 2)[0];
            var tokensArr = block.split(':', 2);
            var key = tokensArr[0].trim(),
                val = tokensArr[1].trim();
            if (/^"[^"]*"$/.test(key)) {
                key = key.slice(1, key.length - 1);
            }
            if (!isNaN(val)) {
                val = Number(val);
            }
            retObj[key] = val;
            str = str.slice(block.length+1).trim();
        }
    }
    return retObj;
};