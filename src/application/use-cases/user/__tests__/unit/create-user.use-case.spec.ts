import { UserInMemoryRepository } from "../../../../../infra/db/in-memory/user/user-in-memory.repository";
import { CreateUserUseCase } from "../../create-user.use-case";

describe("CreateUserUseCase", () => {
  let useCase: CreateUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new CreateUserUseCase(repository);
  });

  it("should create a user", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    let output = await useCase.execute({
      username: "test",
      email: "test@gmail.com",
      password: "password123",
    });

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].user_id.id,
      username: "test",
      email: "test@gmail.com",
      password: "password123",
      is_active: true,
      created_at: repository.items[0].created_at,
      updated_at: repository.items[0].updated_at,
    });

    output = await useCase.execute({
      username: "test",
      email: "test@gmail.com",
      password: "password123",
      is_active: false,
    });

    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: repository.items[1].user_id.id,
      username: "test",
      email: "test@gmail.com",
      password: "password123",
      is_active: false,
      created_at: repository.items[1].created_at,
      updated_at: repository.items[1].updated_at,
    });
  });
});
