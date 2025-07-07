import { DataType, Sequelize } from "sequelize-typescript";
import { UserModel } from "../user.model";
import { User } from "../../../../../domain/user/user.entity";

describe("UserModel (integration tests)", () => {
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

  test("mapping props", () => {
    const attributesMap = UserModel.getAttributes();
    const attributes = Object.keys(attributesMap);
    console.log(attributesMap, attributes);
    expect(attributes).toStrictEqual([
      "user_id",
      "username",
      "email",
      "password",
      "is_active",
      "created_at",
      "updated_at",
    ]);

    const userIdAttribute = attributesMap.user_id;
    expect(userIdAttribute).toMatchObject({
      field: "user_id",
      fieldName: "user_id",
      type: DataType.UUID(),
      primaryKey: true,
    });

    const usernameAttribute = attributesMap.username;
    expect(usernameAttribute).toMatchObject({
      field: "username",
      fieldName: "username",
      type: DataType.STRING(255),
      allowNull: false,
    });

    const emailAttribute = attributesMap.email;
    expect(emailAttribute).toMatchObject({
      field: "email",
      fieldName: "email",
      type: DataType.STRING(),
      allowNull: false,
    });

    const passwordAttribute = attributesMap.password;
    expect(passwordAttribute).toMatchObject({
      field: "password",
      fieldName: "password",
      type: DataType.STRING(),
      allowNull: false,
    });

    const isActiveAttribute = attributesMap.is_active;
    expect(isActiveAttribute).toMatchObject({
      field: "is_active",
      fieldName: "is_active",
      type: DataType.BOOLEAN(),
      allowNull: false,
      defaultValue: true,
    });

    const createdAtAttribute = attributesMap.created_at;
    expect(createdAtAttribute).toMatchObject({
      field: "created_at",
      fieldName: "created_at",
      type: DataType.DATE(),
      allowNull: false,
      defaultValue: DataType.NOW(),
    });

    const updatedAtAttribute = attributesMap.updated_at;
    expect(updatedAtAttribute).toMatchObject({
      field: "updated_at",
      fieldName: "updated_at",
      type: DataType.DATE(),
      allowNull: false,
      defaultValue: DataType.NOW(),
    });
  });

  test("create a user", async () => {
    const arrange = {
      user_id: "123e4567-e89b-12d3-a456-426614174000",
      username: "testuser",
      email: "testuser@gmail.com",
      password: "password123",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const user = await UserModel.create(arrange);

    expect(user.toJSON()).toStrictEqual(arrange);
  });
});
