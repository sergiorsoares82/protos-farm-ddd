import { Sequelize } from "sequelize-typescript";
import { UserModel } from "../user.model";
import { User } from "../../../../../domain/user/user.entity";
import { UserModelMapper } from "../user-model-mapper";
import type { EntityValidationError } from "../../../../../domain/shared/validators/validation.error";
import { Uuid } from "../../../../../domain/shared/value-objects/uuid.vo";

describe("UserModelMapper Integration Tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [UserModel],
    });
    await sequelize.sync();
  });

  it("should throw an error when user is invalid", async () => {
    const model = UserModel.build({
      user_id: "9366b7dc-2d71-4799-b91c-c64adb205104",
    });

    try {
      UserModelMapper.toEntity(model);
      fail("Expected an error to be thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as EntityValidationError).error).toMatchObject({
        username: [
          "username should not be empty",
          "username must be a string",
          "username must be shorter than or equal to 255 characters",
        ],
        email: [
          "email should not be empty",
          "email must be a string",
          "email must be shorter than or equal to 255 characters",
        ],
        password: [
          "password should not be empty",
          "password must be a string",
          "password must be shorter than or equal to 50 characters",
        ],
      });
    }
  });

  it("should convert UserModel to User entity", () => {
    const created_at = new Date();
    const updated_at = new Date();
    const model = UserModel.build({
      user_id: "9366b7dc-2d71-4799-b91c-c64adb205104",
      username: "test_user",
      email: "test_user@gmail.com",
      password: "test_password",
      is_active: true,
      created_at,
      updated_at,
    });

    const entity = UserModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(
      new User({
        user_id: new Uuid(model.user_id),
        username: model.username,
        email: model.email,
        password: model.password,
        is_active: model.is_active,
        created_at: model.created_at,
        updated_at: model.updated_at,
      }).toJSON()
    );
  });

  it("should convert User entity to UserModel", () => {
    const created_at = new Date();
    const updated_at = new Date();

    const user = new User({
      user_id: new Uuid("9366b7dc-2d71-4799-b91c-c64adb205104"),
      username: "test_user",
      email: "test_user@gmail.com",
      password: "test_password",
      is_active: true,
      created_at,
      updated_at,
    });

    const model = UserModelMapper.toModel(user);

    expect(model.toJSON()).toStrictEqual({
      user_id: user.user_id.id,
      username: user.username,
      email: user.email,
      password: user.password,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  });
});
