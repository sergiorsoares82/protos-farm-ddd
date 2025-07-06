import { InvalidUuidError, Uuid } from "../uuid.vo";

describe("UUID Value Object Unit Tests", () => {
  it("should create a valid UUID", () => {
    const uuid = new Uuid();
    expect(uuid.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it("should create a UUID from a valid string", () => {
    const validUuid = "123e4567-e89b-12d3-a456-426614174000";
    const uuid = new Uuid(validUuid);
    expect(uuid.id).toBe(validUuid);
  });

  it("should throw an error for an invalid UUID", () => {
    const invalidUuid = "invalid-uuid-string";
    expect(() => new Uuid(invalidUuid)).toThrow(
      new InvalidUuidError(`Invalid UUID: ${invalidUuid}`)
    );
  });
});
