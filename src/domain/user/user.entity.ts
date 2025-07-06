import { Entity } from "../shared/entity";
import { EntityValidationError } from "../shared/validators/validation.error";
import { Uuid } from "../shared/value-objects/uuid.vo";
import { UserValidatorFactory } from "./user.validator";

export type UserConstructorProps = {
  user_id?: Uuid;
  username: string;
  email: string;
  password: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export type UserCreateCommand = Omit<
  UserConstructorProps,
  "user_id" | "created_at" | "updated_at"
>;

export class User extends Entity {
  user_id: Uuid;
  username: string;
  email: string;
  password: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(props: UserConstructorProps) {
    super();
    this.user_id = props.user_id ?? new Uuid();
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
    this.updated_at = props.updated_at ?? new Date();
  }

  get entity_id(): Uuid {
    return this.user_id;
  }

  static create(props: UserCreateCommand): User {
    const user = new User(props);
    User.validate(user);
    return user;
  }

  changeUserName(username: string): void {
    this.username = username;
    this.updated_at = new Date();
    User.validate(this);
  }

  changeEmail(email: string): void {
    this.email = email;
    this.updated_at = new Date();
    User.validate(this);
  }

  changePassword(password: string): void {
    this.password = password;
    this.updated_at = new Date();
    User.validate(this);
  }

  activate(): void {
    this.is_active = true;
    this.updated_at = new Date();
  }

  deactivate(): void {
    this.is_active = false;
    this.updated_at = new Date();
  }

  static validate(entity: User) {
    const validator = UserValidatorFactory.create();
    const isValid = validator.validate(entity);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  toJSON() {
    return {
      user_id: this.user_id,
      username: this.username,
      email: this.email,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
