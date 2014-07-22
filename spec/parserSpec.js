describe('JSON Parser', function () {
    var parser;
    beforeEach(function () {
        parser = new Parser();
    });
    describe('parsing single key:val pair', function () {
        it('parsing an empty object', function () {
            expect(parser.parse('{}')).toEqual({});
        });

        describe('key and value are numbers', function () {

            it('parsing an object with integers key & val', function () {
                var objStr = "{\n \t 1: 1\n}";
                var obj = {1: 1};
                expect(parser.parse(objStr)).toEqual(obj);
            });
            it('parsing an object with negative integer as a value', function () {
                var objStr = "{1: -1\n}";
                var obj = {1: -1};
                expect(parser.parse(objStr)).toEqual(obj);
            });
            it('parsing an object with floating number as value', function () {
                var objStr = "{1: -1.9999\n}";
                var obj = {1: -1.9999};
                expect(parser.parse(objStr)).toEqual(obj);
            });
            it('parsing floating number without digits after the point', function () {
                var objStr = "{1: -987.\n}";
                var obj = {1: -987.};
                expect(parser.parse(objStr)).toEqual(obj);
            });
        });
        describe('key is a String and value are numbers', function () {

            it('parsing an object with integers val', function () {
                var objStr = "{\n \t \"1\": 1\n}";
                var obj = {"1": 1};
                expect(parser.parse(objStr)).toEqual(obj);
            });
            it('key is empty string', function () {
                var objStr = '{"": -1\n}';
                var obj = {"": -1};
                expect(parser.parse(objStr)).toEqual(obj);
            });
        });
        describe('key and value are Strings', function () {
            it('value is empty string', function () {
                var obj = {"key": ""};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
            it('key is empty string', function () {
                var obj = {"": "value"};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
            it('key and value are the empty string', function () {
                var obj = {"": ""};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
            it('key contains special chars', function () {
                var obj = {"eran!@#$%^&*(){} :;|.,": "amar"};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
            it('value contains special chars', function () {
                var obj = {"eran": "amar!@#$%^&*(){} :;|.,"};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
        });
        describe('key and value are booleans', function () {
            it('value is true', function () {
                var obj = {"key": true};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
            it('value is false', function () {
                var obj = {"": false};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
            it('key and value are booleans', function () {
                var obj = {false: true};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
        });
        describe('key and value are null', function () {
            it('value is null', function () {
                var obj = {"123": null};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
            it('key is null', function () {
                var obj = {null: 123};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
            it('key and value are null', function () {
                var obj = {null: null};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
        });
        describe('supporting inner objects', function () {
            it('value is empty object', function () {
                var obj = {"obj": {}};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
            it('value is nested object', function () {
                var obj = {'obj': {'innerObj':{}}};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
            it('value is simple object with key:val pair', function () {
                var obj = {'obj': {'a': 123}};
                expect(parser.parse(JSON.stringify(obj))).toEqual(obj);
            });
        });

    });

    describe('multiple key:value pairs', function () {
        describe('all keys & values are numbers', function () {

            it('2 integer pairs', function () {
                var obj = {1: 1, 2: 2};
                var objStr = '{1:1 , 2:2}';
                expect(parser.parse(objStr)).toEqual(obj);
            });
            it('2 floating number pairs', function () {
                var obj = {1.5: -0.6, 12: -199.0};
                var objStr = '{1.5: -0.6, 12:-199.}';
                expect(parser.parse(objStr)).toEqual(obj);
            });
            it('7 mixing pairs', function () {
                var obj = {
                    0: 0.1,
                    1: -5,
                    '2': 2.,
                    '3': -4,
                    '5.5': -5.5,
                    '0.6': -6,
                    '12.': -199.
                };
                var objStr = JSON.stringify(obj);
                expect(parser.parse(objStr)).toEqual(obj);
            });
        });
        describe('mixing types ', function () {
            it('object of 7 pairs: strings & numbers', function () {
                var obj = {
                    "eran": "Amar!",
                    "weired chars": "!@#$%^&*()-[]{};",
                    "number as a STRING": "123",
                    '3': -4,
                    '5.5': -5.5,
                    0.6: -6,
                    '12.': -199.
                };
                var objStr = JSON.stringify(obj);
                expect(parser.parse(objStr)).toEqual(obj);
            });
            it('object of 7 pairs: strings, numbers & booleans', function () {
                var obj = {
                    "eran": null,
                    null: "!@#$%^&*()-[]{};",
                    "number as a STRING": "123",
                    true: -4,
                    false: -5.5,
                    0.6: true,
                    '12.': false
                };
                var objStr = JSON.stringify(obj);
                expect(parser.parse(objStr)).toEqual(obj);
            });
        });

    });

    describe('invalid structure of the JSON', function () {
        it('throws error for missing closing "}" for trivial object', function () {
            expect(function () {
                parser.parse('{');
            }).toThrow('Missing "}" at the end of object');
        });
        it('throws error for missing closing "}" for non-trivial object', function () {
            expect(function () {
                parser.parse('{ 1: 1');
            }).toThrow('Missing "}" at the end of object');
        });
        it('throws error for missing opening "{" for the trivial object', function () {
            var objStr = '}';
            expect(function () {
                parser.parse(objStr);
            }).toThrow("Can't match \"\\{\" in the beginning of: }");
        });
        it('throws error for missing opening "{" for the trivial object', function () {
            var objStr = '1: 1 }';
            expect(function () {
                parser.parse(objStr);
            }).toThrow("Can't match \"\\{\" in the beginning of: 1");
        });
        it('throws error for floating number with TOW points instead of one', function () {
            var objStr = '{ 1: 1.. }';
            expect(function () {
                parser.parse(objStr);
            }).toThrow("Can't find next token in: . }");
        });
    });
});