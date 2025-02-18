import { NudgeConverter } from "@/utils/nudgeConverter";

describe("NudgeConverter", () => {
  describe("jsonToJsObject", () => {
    it("should convert JSON to JS object format", () => {
      const input = '{"name": "John", "age": 30}';
      const result = NudgeConverter.jsonToJsObject(input);
      expect(result).toContain('name: "John"');
      expect(result).toContain("age: 30");
    });

    it("should convert nested objects correctly", () => {
      const input = '{"user":{"name":"John","age":30}}';
      const expected = '{ user: { name: "John", age: 30 } }';
      expect(NudgeConverter.jsonToJsObject(input)).toBe(expected);
    });

    it("should convert arrays with mixed types correctly", () => {
      const input = '{"items":[1,"two",null,{"x":1}]}';
      const expected = '{ items: [1, "two", null, { x: 1 }] }';
      expect(NudgeConverter.jsonToJsObject(input)).toBe(expected);
    });

    it("should handle special characters correctly", () => {
      const input = '{"text":"Line\\nBreak\\tTab\\"Quote"}';
      const expected = '{ text: "Line\\nBreak\\tTab\\"Quote" }';
      expect(NudgeConverter.jsonToJsObject(input)).toBe(expected);
    });

    it("should handle special property names correctly", () => {
      const input = '{"special-key":123,"$key":456}';
      const expected = '{ "special-key": 123, $key: 456 }';
      expect(NudgeConverter.jsonToJsObject(input)).toBe(expected);
    });

    it.skip("should handle empty structures correctly", () => {
      const input = '{"empty":{},"emptyArray":[]}';
      const expected = "{ empty: {}, emptyArray: [] }";
      expect(NudgeConverter.jsonToJsObject(input)).toBe(expected);
    });

    it("should throw error for invalid JSON", () => {
      const input = '{"invalid": "json",}';
      expect(() => NudgeConverter.jsonToJsObject(input)).toThrow("Invalid JSON input");
    });
  });

  describe("jsObjectToJson", () => {
    it("should convert JS object to JSON", () => {
      const input = "{name: 'John', age: 30}";
      const result = NudgeConverter.jsObjectToJson(input);
      expect(result).toBe('{"name":"John","age":30}');
    });

    it("should convert nested objects correctly", () => {
      const input = '{ user: { name: "John", age: 30 } }';
      const expected = '{"user":{"name":"John","age":30}}';
      expect(NudgeConverter.jsObjectToJson(input)).toBe(expected);
    });

    it("should convert arrays with mixed types correctly", () => {
      const input = '{ items: [1, "two", null, { x: 1 }] }';
      const expected = '{"items":[1,"two",null,{"x":1}]}';
      expect(NudgeConverter.jsObjectToJson(input)).toBe(expected);
    });

    it("should convert undefined values to null", () => {
      const input = '{ name: "John", status: undefined, data: { age: 30 } }';
      const expected = '{"name":"John","status":null,"data":{"age":30}}';
      expect(NudgeConverter.jsObjectToJson(input)).toBe(expected);
    });

    it("should handle pre-quoted property names correctly", () => {
      const input = '{ "special-key": 123, "normal": 456 }';
      const expected = '{"special-key":123,"normal":456}';
      expect(NudgeConverter.jsObjectToJson(input)).toBe(expected);
    });

    it("should handle special characters correctly", () => {
      const input = '{ text: "Line\\nBreak\\tTab\\"Quote" }';
      const expected = '{"text":"Line\\nBreak\\tTab\\"Quote"}';
      expect(NudgeConverter.jsObjectToJson(input)).toBe(expected);
    });

    it("should throw error for invalid JavaScript object literal", () => {
      const input = "{ invalid: syntax, }";
      expect(() => NudgeConverter.jsObjectToJson(input)).toThrow("Invalid JavaScript object literal");
    });
  });

  describe("toUnicode", () => {
    it("should convert string to Unicode", () => {
      const input = "Hello";
      const result = NudgeConverter.toUnicode(input);
      expect(result).toBe("\\u0048\\u0065\\u006c\\u006c\\u006f");
    });
  });

  describe("fromUnicode", () => {
    it("should convert Unicode to string", () => {
      const input = "\\u0048\\u0065\\u006c\\u006c\\u006f";
      const result = NudgeConverter.fromUnicode(input);
      expect(result).toBe("Hello");
    });
  });

  describe("trimStart", () => {
    it("should trim start of string", () => {
      const input = "  Hello World";
      const result = NudgeConverter.trimStart(input);
      expect(result).toBe("Hello World");
    });
  });

  describe("trimEnd", () => {
    it("should trim end of string", () => {
      const input = "Hello World  ";
      const result = NudgeConverter.trimEnd(input);
      expect(result).toBe("Hello World");
    });
  });
});
