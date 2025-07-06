import { ValueObject } from "../value-object";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

export class Uuid extends ValueObject {
  readonly id: string;

  constructor(id?: string) {
    super();
    this.id = id || uuidv4();
    this.validateUuid(this.id);
  }

  private validateUuid(uuid: string): boolean {
    const isValid = uuidValidate(uuid);
    if (!isValid) {
      throw new InvalidUuidError(`Invalid UUID: ${uuid}`);
    }
    return isValid;
  }
}

export class InvalidUuidError extends Error {
  constructor(message?: string) {
    super(message || "ID must be a valida UUID");
    this.name = "InvalidUuidError";
  }
}
