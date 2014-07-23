describe('JSON Parser', function () {
    var parser;
    beforeEach(function () {
        parser = new Parser();
    });
    describe('parsing single key:val pair', function () {
        it('parsing an empty object', function () {
            expect(parser.parse('{}')).toEqual({});
        });
        it('parsing an object with one k:v pair', function () {
            expect(parser.parse('{"a": 1}')).toEqual({'a': 1});
        });

    });

});