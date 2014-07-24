/**
 * Created by Eyal_Sadeh on 7/22/14.
 */
function remove_spaces(str){
    return str;
}

describe ('eyals tests', function () {
    describe("json parser", function () {
        var parser;
        beforeEach(function () {
            parser = new Parser();

        });


        it("should generate empty json object for {}", function () {
            expect(parser.parse('{}')).toEqual({});
        });

        it("should parse object with one field", function () {
            expect(parser.parse('{ "a": 3}')).toEqual({ a: 3});
        });

        it("should parse object with spaces", function () {
            expect(parser.parse('{  "a"   :   4   }')).toEqual({ a: 4});
        });

        it("should parse numbers received as string", function () {
            expect(parser.parse('{  "a"   :   "4"   }')).toEqual({ a: '4'});
        });

        it("should parse object with spaces", function () {
            expect(parser.parse('{  "a"   :   "abc"   }')).toEqual({ a: 'abc'});
        });

        it("should parse boolean values", function () {
            expect(parser.parse('{  "a"   :   true   }')).toEqual({ a: true });
        });

        it("should parse boolean as string", function () {
            expect(parser.parse('{  "a"   :   "true"   }')).toEqual({ a: 'true' });
        });

        it("should parse empty array", function () {
            expect(parser.parse('{  "a"   :   []   }')).toEqual({ a: [] });
        });

        it("should parse array with one number", function () {
            expect(parser.parse('{  "a"   :   [1]   }')).toEqual({ a: [1] });
        });

        it("should parse array with two numbers", function () {
            expect(parser.parse('{  "a"   :   [1,2]   }')).toEqual({ a: [1, 2] });
        });

        it("should parse object with 2 fields", function () {
            expect(parser.parse('{ "a" : 1, "b" : 2}')).toEqual({ a: 1, b: 2});
        });

        it("should parse object with inner object", function () {
            expect(parser.parse('{ "a" : {"b" : 1}}')).toEqual({ a: {b: 1}});
        });


        it("should parse object with inner array", function () {
            expect(parser.parse('{ "a" :[1 , 2, [3 , 4 , 5]]}')).toEqual({ a: [1, 2, [3, 4, 5]]});
        });

        it("should parse object with inner array", function () {
            expect(parser.parse('{ "a" :[1 , 2, { "b" : 5}, [3 , false , 5]]}')).toEqual({ a: [1, 2, { b: 5 }, [3, false, 5]]});
        });


    });

    describe("json to string", function () {
        var parser;
        beforeEach(function () {
            parser = new Parser();
            parser.toStr = parser.print;

        });

        it("should generate '{} for empty json object", function () {
            expect(remove_spaces(parser.toStr({}))).toEqual(remove_spaces('{}'));
        });

        it("should parse object with one field", function () {
            expect(remove_spaces(parser.toStr({ a: 3}))).toEqual(remove_spaces('{"a":3}'));
        });

        it("should parse any object with one field", function () {
            expect(remove_spaces(parser.toStr({ b: 5}))).toEqual(remove_spaces('{"b":5}'));
        });

        it("should parse object with two field", function () {
            expect(remove_spaces(parser.toStr({ b: 5, c: 6}))).toEqual(remove_spaces('{"b":5,"c":6}'));
        });

        it("should parse object with string field", function () {
            expect(remove_spaces(parser.toStr({ a: 'abc'}))).toEqual(remove_spaces('{"a":"abc"}'));
        });

        it("should parse object with boolean field", function () {
            expect(remove_spaces(parser.toStr({ a: true}))).toEqual(remove_spaces('{"a":true}'));
        });

        it("should parse object with array field", function () {
            expect(remove_spaces(parser.toStr({ a: [1, 2 , 4]}))).toEqual(remove_spaces('{"a":[1,2,4]}'));
        });


        it("should parse object with array field", function () {
            expect(remove_spaces(parser.toStr({ a: {b: 5, c: 3}}))).toEqual(remove_spaces('{"a":{"b":5,"c":3}}'));
        });

    });
});