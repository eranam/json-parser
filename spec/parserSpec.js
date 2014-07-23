describe('JSON Parser', function () {
    var parser;
    beforeEach(function () {
        parser = new Parser();
    });
    describe('parsing single key:val pair', function () {
        it('parsing an empty object', function () {
            expect(parser.parse('{}')).toEqual({});
        });

    });

});