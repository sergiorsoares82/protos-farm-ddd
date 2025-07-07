import { Uuid } from "../../../../domain/shared/value-objects/uuid.vo";
import { User } from "../../../../domain/user/user.entity";
import { UserModel } from "./user.model";

export class UserModelMapper {
  static toModel(entity: User): UserModel {
    return UserModel.build({
      user_id: entity.user_id.id,
      username: entity.username,
      email: entity.email,
      password: entity.password,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }

  static toEntity(model: UserModel): User {
    const entity = new User({
      user_id: new Uuid(model.user_id),
      username: model.username,
      email: model.email,
      password: model.password,
      is_active: model.is_active,
      created_at: model.created_at,
      updated_at: model.updated_at,
    });

    User.validate(entity);
    return entity;
  }
}
