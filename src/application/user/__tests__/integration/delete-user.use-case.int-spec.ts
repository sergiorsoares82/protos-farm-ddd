import { NotFoundError } from "../../../../domain/shared/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../domain/shared/value-objects/uuid.vo";
import { User } from "../../../../domain/user/user.entity";
import { UserSequelizeRepository } from "../../../../infra/db/sequelize/user/user-sequelize.repository";
import { UserModel } from "../../../../infra/db/sequelize/user/user.model";
import { setupSequelize } from "../../../../infra/shared/testing/helpers";
import { DeleteUserUseCase } from "../../delete-user.use-case";

describe("DeleteUserUseCase Unit Test", () => {
  let useCase: DeleteUserUseCase;
  let repository: UserSequelizeRepository;

  setupSequelize({ models: [UserModel] });

  beforeEach(() => {
    repository = new UserSequelizeRepository(UserModel);
    useCase = new DeleteUserUseCase(repository);
  });

  it("should delete a user", async () => {
    const spyDelete = jest.spyOn(repository, "delete");
    const user = User.fake().aUser().build();

    await repository.insert(user);

    await useCase.execute({ id: user.user_id.id });

    expect(spyDelete).toHaveBeenCalledTimes(1);
    await expect(repository.findById(user.user_id)).resolves.toBeNull();
  });

  it("should throw an error when trying to delete a non-existing user", async () => {
    const nonExistingId = "non-existing-id";

    await expect(() => useCase.execute({ id: nonExistingId })).rejects.toThrow(
      new InvalidUuidError(`Invalid UUID: ${nonExistingId}`)
    );

    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, User)
    );
  });
});
