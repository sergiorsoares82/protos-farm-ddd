export type UserConstructorProps = {
  user_id?: string;
  username: string;
  email: string;
  password: string;
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
  created_at: Date;
  updated_at: Date;

  constructor(props: UserConstructorProps) {
    // @ts-ignore
    this.user_id = props.user_id;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.created_at = props.created_at ?? new Date();
    this.updated_at = props.updated_at ?? new Date();
  }

  static create(props: UserCreateCommand): User {
    return new User(props);
  }

  update(props: Partial<UserConstructorProps>): User {
    return new User({
      ...this,
      ...props,
      updated_at: new Date(),
    });
  }
}
