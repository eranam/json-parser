describe('JSON Parser', function () {
    var parser;
    beforeEach(function () {
        parser = new Parser();
    });
    describe('parsing numbers', function () {
        it('parsing an empty object', function () {
            expect(parser.parse('{}')).toEqual({});
        });
        it('parsing an object with one k:v pair', function () {
            expect(parser.parse('{ "a":  1}')).toEqual({'a': 1});
        });
        it('parsing an object with tow simple pairs', function (){
            var obj = {'a':1, 'b': 2};
            expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
        });
        it('parsing an object with 3 simple pairs', function (){
            var obj = {'a': 1, 'b': 2, 'c': 3};
            expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
        });
    });

    describe('parsing strings', function (){
        it('parsing single pair', function (){
            var obj = {'a': 'eran amar'};
            expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
        });
    });

});