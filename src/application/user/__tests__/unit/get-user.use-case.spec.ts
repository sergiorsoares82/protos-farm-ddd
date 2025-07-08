import { NotFoundError } from "../../../../domain/shared/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../domain/shared/value-objects/uuid.vo";
import { User } from "../../../../domain/user/user.entity";
import { UserInMemoryRepository } from "../../../../infra/db/in-memory/user/user-in-memory.repository";
import { GetUserUseCase } from "../../get-user.use-case";

describe("GetUserUseCase Unit Test", () => {
  let useCase: GetUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new GetUserUseCase(repository);
  });

  it("should get a user", async () => {
    const spyFindById = jest.spyOn(repository, "findById");
    const users = [
      User.create({
        username: "test1",
        email: "test1@gmail.com",
        password: "password123",
      }),
    ];

    repository.items = users;

    const output = await useCase.execute({ id: users[0].user_id.id });
    expect(spyFindById).toHaveBeenCalledWith(users[0].user_id);
    expect(output).toStrictEqual({
      id: users[0].user_id.id,
      username: users[0].username,
      email: users[0].email,
      is_active: users[0].is_active,
      created_at: users[0].created_at,
      updated_at: users[0].updated_at,
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
