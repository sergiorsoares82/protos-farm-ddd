import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import type { User } from "./user.entity";
import { ClassValidatorFields } from "../shared/validators/class-validators-fields";
import type { Notification } from "../shared/validators/notification";

export class UserRules {
  // @IsString()
  // @IsNotEmpty()
  @MaxLength(255)
  username: string;

  // @IsString()
  // @IsNotEmpty()
  @MaxLength(255)
  email: string;

  // @IsString()
  // @IsNotEmpty()
  @MaxLength(50)
  password: string;

  constructor(user: User) {
    Object.assign(this, user);
  }
}

// export class UserValidator extends ClassValidatorFields<UserRules> {
//   validate(entity: User): boolean {
//     return super.validate(new UserRules(entity));
//   }
// }

export class UserValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ["username"];
    return super.validate(notification, new UserRules(data), newFields);
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator();
  }
}
