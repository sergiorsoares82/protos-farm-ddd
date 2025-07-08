import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
  type ValidationError,
} from "class-validator";

export type CreateUserInputConstructorProps = {
  username: string;
  email: string;
  password: string;
  is_active?: boolean;
};

export class CreateUserInput {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  constructor(props: CreateUserInputConstructorProps) {
    if (!props) {
      return;
    }
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.is_active = props.is_active ?? true; // Default to true if not provided
  }
}

export class ValidateCreateUserInput {
  static validate(input: CreateUserInput): ValidationError[] {
    return validateSync(input);
  }
}
