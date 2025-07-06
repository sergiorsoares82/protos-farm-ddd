import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import type { User } from "./user.entity";
import { ClassValidatorFields } from "../shared/validators/class-validators-fields";

export class UserRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  username: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  email: string;

  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  password: string;

  constructor({ username, email, password }: User) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(entity: User): boolean {
    return super.validate(new UserRules(entity));
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator();
  }
}
