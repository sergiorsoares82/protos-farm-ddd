import { ValueObject } from "../value-object";

class SimpleValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(readonly prop1: string, readonly prop2: number) {
    super();
  }
}

describe("ValueObject Unit Tests", () => {
  it("should return true for equal simple value objects", () => {
    const vo1 = new SimpleValueObject("test");
    const vo2 = new SimpleValueObject("test");
    expect(vo1.equals(vo2)).toBe(true);
  });

  it("should return false for different simple value objects", () => {
    const vo1 = new SimpleValueObject("test1");
    const vo2 = new SimpleValueObject("test2");
    expect(vo1.equals(vo2)).toBe(false);
  });

  it("should return false for different types of value objects", () => {
    const vo1 = new SimpleValueObject("test");
    const vo2 = new ComplexValueObject("test", 123);
    expect(vo1.equals(vo2)).toBe(false);
  });

  it("should return true for equal complex value objects", () => {
    const vo1 = new ComplexValueObject("test", 123);
    const vo2 = new ComplexValueObject("test", 123);
    expect(vo1.equals(vo2)).toBe(true);
  });

  it("should return false for different complex value objects", () => {
    const vo1 = new ComplexValueObject("test1", 123);
    const vo2 = new ComplexValueObject("test2", 456);
    expect(vo1.equals(vo2)).toBe(false);
  });
  it("should return false for complex value object and simple value object", () => {
    const vo1 = new ComplexValueObject("test", 123);
    const vo2 = new SimpleValueObject("test");
    expect(vo1.equals(vo2)).toBe(false);
  });
});
