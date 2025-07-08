import type { User } from "../../../../domain/user/user.entity";

export type UserOutput = {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export class UserOutputMapper {
  static toOutput(user: User): UserOutput {
    const { user_id, ...otherProps } = user.toJSON();
    return {
      id: user_id.id,
      ...otherProps,
    };
  }
}
