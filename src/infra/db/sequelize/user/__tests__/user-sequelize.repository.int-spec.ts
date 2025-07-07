import { Sequelize } from "sequelize-typescript";
import { UserSequelizeRepository } from "../user-sequelize.repository";
import { UserModel } from "../user.model";
import { User } from "../../../../../domain/user/user.entity";
import { Uuid } from "../../../../../domain/shared/value-objects/uuid.vo";
import { NotFoundError } from "../../../../../domain/shared/errors/not-found.error";

describe("UserSequelizeRepository Integration Tests", () => {
  let sequelize: Sequelize;
  let repository: UserSequelizeRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [UserModel],
    });
    await sequelize.sync();
    repository = new UserSequelizeRepository(UserModel);
  });

  it("should insert a user", async () => {
    let user = User.fake().aUser().build();
    await repository.insert(user);
    let entity = await repository.findById(user.user_id);
    expect(entity.toJSON()).toStrictEqual(user.toJSON());
  });

  it("should find an user by id", async () => {
    let user = User.fake().aUser().build();
    await repository.insert(user);
    let entity = await repository.findById(user.user_id);
    expect(entity.toJSON()).toStrictEqual(user.toJSON());
  });

  it("should return null when user not found", async () => {
    let entity = await repository.findById(new Uuid());
    expect(entity).toBeNull();
  });

  it("should return all users", async () => {
    let user1 = User.fake().aUser().build();
    let user2 = User.fake().aUser().build();
    await repository.insert(user1);
    await repository.insert(user2);
    let entities = await repository.findAll();
    expect(entities).toHaveLength(2);
    expect(entities[0].toJSON()).toStrictEqual(user1.toJSON());
    expect(entities[1].toJSON()).toStrictEqual(user2.toJSON());
  });

  it("should update an user", async () => {
    let user = User.fake().aUser().build();
    await repository.insert(user);
    user.changeUserName("updated_name");
    user.changeEmail("updated@email.com");
    user.changePassword("updated_password");
    await repository.update(user);
    let entity = await repository.findById(user.user_id);
    expect(entity.toJSON()).toStrictEqual(user.toJSON());
  });

  it("should throw an error when updating a non-existing user", async () => {
    let user = User.fake().aUser().build();
    await expect(repository.update(user)).rejects.toThrow(
      new NotFoundError(user.user_id.id, User)
    );
  });

  it("should delete an user", async () => {
    let user = User.fake().aUser().build();
    await repository.insert(user);
    await repository.delete(user.user_id);
    let entity = await repository.findById(user.user_id);
    expect(entity).toBeNull();
  });
});
