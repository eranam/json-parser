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

    describe('parsing mixed types - acceptance tests', function () {
        it('long object with multiple value types', function () {
            var obj = {
                'a': null,
                'b': 123,
                'c': 12.5,
                'd': -5,
                'e': true,
                'f': false,
                'g': '!@#$%^&*()_+/;><?. eran amar '
            };
            expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
        });
        it('long object with multiple value types', function () {
            var obj = { 'a': null};
            var str = '{"a":"first value", "a": -8.99, "a": null}';
            expect(parser.parse(str)).toEqual(obj);
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
            }).toThrow("unrecognized next token in: 'eran'}");
        });

        it('first pair ok, next pair missing double quotes for string', function () {
            expect(function () {
                parser.parse('{"OkValue": true, "BadValue": \'eran\'}');
            }).toThrow("unrecognized next token in: 'eran'}");
        });
        it('key is not passed with double quotes', function () {
            expect(function () {
                parser.parse('{ badKey : true}');
            }).toThrow("unrecognized next token in: badKey : true}");
        });
    });
    describe('parsing arrays', function () {

        xit('parsing empty array', function () {
            var obj = {'a': []};
            expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
        });
    });
});