import { isEqual } from "lodash";

export abstract class ValueObject {
  public equals(vo: ValueObject): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.constructor.name !== this.constructor.name) {
      return false;
    }
    return isEqual(vo, this);
  }
}
