/**
 * Created by Eyal_Sadeh on 7/22/14.
 */
xdescribe("json parser", function() {
    var parser;
    beforeEach(function () {
        parser = new Parser();

    });


    it("should generate empty json object for {}", function () {
        expect(parser.parse('{}')).toEqual({});
    });

    it("should parse object with one field", function () {
        expect(parser.parse('{ "a": 3}')).toEqual({ a : 3});
    });

    it("should parse object with spaces", function () {
        expect(parser.parse('{  "a"   :   4   }')).toEqual({ a : 4});
    });

    it("should parse numbers received as string", function () {
        expect(parser.parse('{  "a"   :   "4"   }')).toEqual({ a : '4'});
    });

    it("should parse object with spaces", function () {
        expect(parser.parse('{  "a"   :   "abc"   }')).toEqual({ a : 'abc'});
    });

    it("should parse boolean values", function () {
        expect(parser.parse('{  "a"   :   true   }')).toEqual({ a : true });
    });

    it("should parse boolean as string", function () {
        expect(parser.parse('{  "a"   :   "true"   }')).toEqual({ a : 'true' });
    });

    it("should parse empty array", function () {
        expect(parser.parse('{  "a"   :   []   }')).toEqual({ a : [] });
    });

    it("should parse array with one number", function () {
        expect(parser.parse('{  "a"   :   [1]   }')).toEqual({ a : [1] });
    });

    it("should parse array with two numbers", function () {
        expect(parser.parse('{  "a"   :   [1,2]   }')).toEqual({ a : [1,2] });
    });

    it("should parse object with 2 fields", function () {
        expect(parser.parse('{ "a" : 1, "b" : 2}')).toEqual({ a : 1 , b : 2});
    });

    it("should parse object with inner object", function () {
        expect(parser.parse('{ "a" : {"b" : 1}}')).toEqual({ a : {b : 1}});
    });


    it("should parse object with inner array", function () {
        expect(parser.parse('{ "a" :[1 , 2, [3 , 4 , 5]]}')).toEqual({ a : [1, 2, [3,4,5]]});
    });


});
