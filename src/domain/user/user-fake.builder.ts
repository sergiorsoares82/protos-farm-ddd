import { Chance } from "chance";
import { Uuid } from "../shared/value-objects/uuid.vo";
import { User } from "./user.entity";

type PropOrFactory<T> = T | ((index: number) => T);

export class UserFakeBuilder<TBuild = any> {
  // auto generated in entity
  private _user_id: PropOrFactory<Uuid> | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _username: PropOrFactory<string> = (_index) => this.chance.word();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _email: PropOrFactory<string> = (_index) => this.chance.email();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _password: PropOrFactory<string | null> = (_index) =>
    this.chance.word();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _is_active: PropOrFactory<boolean> = (_index) => true;
  // auto generated in entity
  private _created_at: PropOrFactory<Date> | undefined = undefined;

  private countObjs;

  static aUser() {
    return new UserFakeBuilder<User>();
  }

  static theCategories(countObjs: number) {
    return new UserFakeBuilder<User[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withUuid(valueOrFactory: PropOrFactory<Uuid>) {
    this._user_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._username = valueOrFactory;
    return this;
  }

  withPassword(valueOrFactory: PropOrFactory<string | null>) {
    this._password = valueOrFactory;
    return this;
  }

  activate() {
    this._is_active = true;
    return this;
  }

  deactivate() {
    this._is_active = false;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._username = value ?? this.chance.word({ length: 256 });
    return this;
  }

  build(): TBuild {
    const users = new Array(this.countObjs).fill(undefined).map((_, index) => {
      const user = new User({
        user_id: !this._user_id
          ? undefined
          : this.callFactory(this._user_id, index),
        username: this.callFactory(this._username, index),
        email: this.callFactory(this._email, index),
        password: this.callFactory(this._password, index),
        is_active: this.callFactory(this._is_active, index),
        ...(this._created_at && {
          created_at: this.callFactory(this._created_at, index),
        }),
      });
      //category.validate();
      return user;
    });
    return this.countObjs === 1 ? (users[0] as any) : (users as any);
  }

  get user_id() {
    return this.getValue("user_id");
  }

  get username() {
    return this.getValue("username");
  }

  get email() {
    return this.getValue("email");
  }

  get password() {
    return this.getValue("password");
  }

  get is_active() {
    return this.getValue("is_active");
  }

  get created_at() {
    return this.getValue("created_at");
  }

  private getValue(prop: any) {
    const optional = ["user_id", "created_at"];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
