import { NotFoundError } from "../../../../domain/shared/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../domain/shared/value-objects/uuid.vo";
import { User } from "../../../../domain/user/user.entity";
import { UserInMemoryRepository } from "../../../../infra/db/in-memory/user/user-in-memory.repository";
import { DeleteUserUseCase } from "../../delete-user.use-case";

describe("DeleteUserUseCase Unit Test", () => {
  let useCase: DeleteUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new DeleteUserUseCase(repository);
  });

  it("should delete a user", async () => {
    const spyDelete = jest.spyOn(repository, "delete");
    const users = [
      new User({
        username: "test1",
        email: "test1@gmail.com",
        password: "password123",
      }),
    ];

    await repository.bulkInsert(users);

    await useCase.execute({ id: users[0].user_id.id });

    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(repository.items).toHaveLength(0);
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
