import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
  type ValidationError,
} from "class-validator";

export type UpdateUserInputConstructorProps = {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
};

export class UpdateUserInput {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  constructor(props: UpdateUserInputConstructorProps) {
    if (!props) {
      return;
    }

    this.id = props.id;
    props.username && (this.username = props.username);
    props.email && (this.email = props.email);
    props.password && (this.password = props.password);
    props.is_active !== null &&
      props.is_active !== undefined &&
      (this.is_active = props.is_active);
  }
}

export class ValidateUpdateUserInput {
  static validate(input: UpdateUserInput): ValidationError[] {
    return validateSync(input);
  }
}
