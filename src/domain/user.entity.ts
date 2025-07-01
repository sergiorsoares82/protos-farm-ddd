export type UserConstructorProps = {
  user_id?: string;
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

export class User {
  user_id: string;
  username: string;
  email: string;
  password: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(props: UserConstructorProps) {
    // @ts-ignore
    this.user_id = props.user_id;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
    this.updated_at = props.updated_at ?? new Date();
  }

  static create(props: UserCreateCommand): User {
    return new User(props);
  }

  changeUserName(username: string): void {
    this.username = username;
    this.updated_at = new Date();
  }

  changeEmail(email: string): void {
    this.email = email;
    this.updated_at = new Date();
  }

  changePassword(password: string): void {
    this.password = password;
    this.updated_at = new Date();
  }

  activate(): void {
    this.is_active = true;
    this.updated_at = new Date();
  }

  deactivate(): void {
    this.is_active = false;
    this.updated_at = new Date();
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
