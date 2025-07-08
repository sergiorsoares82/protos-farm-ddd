import { NotFoundError } from "../../../../domain/shared/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../domain/shared/value-objects/uuid.vo";
import { User } from "../../../../domain/user/user.entity";
import { UserInMemoryRepository } from "../../../../infra/db/in-memory/user/user-in-memory.repository";
import { UserSequelizeRepository } from "../../../../infra/db/sequelize/user/user-sequelize.repository";
import { UserModel } from "../../../../infra/db/sequelize/user/user.model";
import { setupSequelize } from "../../../../infra/shared/testing/helpers";
import { GetUserUseCase } from "../../get-user.use-case";

describe("GetUserUseCase Unit Test", () => {
  let useCase: GetUserUseCase;
  let repository: UserSequelizeRepository;

  beforeEach(() => {
    repository = new UserSequelizeRepository(UserModel);
    useCase = new GetUserUseCase(repository);
  });

  setupSequelize({ models: [UserModel] });

  it("should get a user", async () => {
    const spyFindById = jest.spyOn(repository, "findById");
    const user = User.fake().aUser().build();

    await repository.insert(user);

    const output = await useCase.execute({ id: user.user_id.id });
    expect(spyFindById).toHaveBeenCalledWith(user.user_id);
    expect(output).toStrictEqual({
      id: user.user_id.id,
      username: user.username,
      email: user.email,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  });

  it("should throw an error when user is not found", async () => {
    const spyFindById = jest.spyOn(repository, "findById");
    const userId = "non-existing-id";

    await expect(() => useCase.execute({ id: userId })).rejects.toThrow(
      new InvalidUuidError(`Invalid UUID: ${userId}`)
    );

    const uuid = new Uuid();

    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, User)
    );
    expect(spyFindById).toHaveBeenCalledTimes(1);
  });
});
