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
        it('parsing an object with tow simple pairs', function () {
            var obj = {'a': 1, 'b': 2};
            expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
        });
        it('parsing an object with many pairs', function () {
            var obj = {'a': 1, 'b': 2, 'c': 3};
            expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
        });
    });

    describe('parsing strings', function () {
        /**
         * Philosophic-TDD note: i added a test which check for multiple strings pairs, but it passed immediately
         * because the mechanism that were implemented for number values. Therefore i removed the last test and
         * rename the corresponding number test to "parsing an object with many pairs" to indicate that it covers
         * that issue.
         */
        it('parsing single pair', function () {
            var obj = {'a': 'eran amar'};
            expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
        });
    });

    describe('parsing boolean', function () {
        it('value is true', function () {
            var obj = {'a': true};
            expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
        });
        it('value is false', function () {
            var obj = {'a': false};
            expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
        });
    });

    describe('parsing null', function () {
        it('value is null', function () {
            var obj = {'a': null};
            expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
        });
    });

    describe('invalid input string', function () {
        it('trivial object missing open bracket', function () {
            expect(function () {
                parser.parse('}');
            }).toThrow("missing token: {");
        });
        it('trivial object missing close bracket', function () {
            expect(function () {
                parser.parse('{');
            }).toThrow("missing token: }");
        });

        it('string value is not given with double quotes', function () {
            expect(function () {
                parser.parse('{"a": \'eran\'}');
            }).toThrow("missing token: }");
        });
    });
});