import { NotFoundError } from "../../../../../domain/shared/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../domain/shared/value-objects/uuid.vo";
import { User } from "../../../../../domain/user/user.entity";
import { UserInMemoryRepository } from "../../../../../infra/db/in-memory/user/user-in-memory.repository";
import { UpdateUserUseCase } from "../../update-user.use-case";

describe("UpdateUserUseCase Unit Test", () => {
  let useCase: UpdateUserUseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new UpdateUserUseCase(repository);
  });

  it("should update a user", async () => {
    const spyUpdate = jest.spyOn(repository, "update");
    const user = new User({
      username: "test",
      email: "test@gmail.com",
      password: "password123",
    });

    await repository.insert(user);
    let output = await useCase.execute({
      id: user.user_id.id,
      username: "updated_test",
      email: "updated_email@gmail.com",
      password: "new_password123",
      is_active: true,
    });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: user.user_id.id,
      username: "updated_test",
      email: "updated_email@gmail.com",
      password: "new_password123",
      is_active: true,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });

    type Arrange = {
      input: {
        id: string;
        username: string;
        email: string;
        password: string;
        is_active?: boolean;
      };
      expected: {
        id: string;
        username: string;
        email: string;
        password: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
      };
    };

    const arrange: Arrange[] = [
      {
        input: {
          id: user.user_id.id,
          username: "updated_test",
          email: "updated_email@gmail.com",
          password: "new_password123",
          is_active: false,
        },
        expected: {
          id: user.user_id.id,
          username: "updated_test",
          email: "updated_email@gmail.com",
          password: "new_password123",
          is_active: false,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
      {
        input: {
          id: user.user_id.id,
          username: "single_updated_test",
          email: "updated_email@gmail.com",
          password: "new_password123",
          is_active: false,
        },
        expected: {
          id: user.user_id.id,
          username: "single_updated_test",
          email: "updated_email@gmail.com",
          password: "new_password123",
          is_active: false,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
      {
        input: {
          id: user.user_id.id,
          username: "single_updated_test",
          email: "single_updated_email@gmail.com",
          password: "new_password123",
          is_active: false,
        },
        expected: {
          id: user.user_id.id,
          username: "single_updated_test",
          email: "single_updated_email@gmail.com",
          password: "new_password123",
          is_active: false,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
      {
        input: {
          id: user.user_id.id,
          username: "single_updated_test",
          email: "updated_email@gmail.com",
          password: "update_new_password123",
          is_active: false,
        },
        expected: {
          id: user.user_id.id,
          username: "single_updated_test",
          email: "updated_email@gmail.com",
          password: "update_new_password123",
          is_active: false,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
    ];

    for (const item of arrange) {
      output = await useCase.execute(item.input);
      expect(spyUpdate).toHaveBeenCalledTimes(arrange.indexOf(item) + 2);
      expect(output).toStrictEqual({
        id: item.expected.id,
        username: item.expected.username,
        email: item.expected.email,
        password: item.expected.password,
        is_active: item.expected.is_active,
        created_at: item.expected.created_at,
        updated_at: output.updated_at,
      });
    }
  });

  it("should throw an error when user not found", async () => {
    await expect(() =>
      useCase.execute({
        id: "non-existing-id",
        username: "test",
        email: "test@gmail.com",
        password: "password123",
        is_active: true,
      })
    ).rejects.toThrow(new InvalidUuidError(`Invalid UUID: non-existing-id`));

    const uuid = new Uuid();

    await expect(() =>
      useCase.execute({
        id: uuid.id,
        email: "test@gmail.com",
        password: "password123",
      })
    ).rejects.toThrow(new NotFoundError(uuid.id, User));
  });
});
