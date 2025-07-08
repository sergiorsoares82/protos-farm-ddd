import { Uuid } from "../../../../../domain/shared/value-objects/uuid.vo";
import { UserInMemoryRepository } from "../../../../../infra/db/in-memory/user/user-in-memory.repository";
import { UserSequelizeRepository } from "../../../../../infra/db/sequelize/user/user-sequelize.repository";
import { UserModel } from "../../../../../infra/db/sequelize/user/user.model";
import { setupSequelize } from "../../../../../infra/shared/testing/helpers";
import { CreateUserUseCase } from "../../create-user/create-user.use-case";

describe("CreateUserUseCase", () => {
  let useCase: CreateUserUseCase;
  let repository: UserSequelizeRepository;

  setupSequelize({ models: [UserModel] });

  beforeEach(() => {
    repository = new UserSequelizeRepository(UserModel);
    useCase = new CreateUserUseCase(repository);
  });

  it("should create a user", async () => {
    let output = await useCase.execute({
      username: "test",
      email: "test@gmail.com",
      password: "password123",
    });
    let entity = await repository.findById(new Uuid(output.id));

    expect(output).toStrictEqual({
      id: entity.user_id.id,
      username: "test",
      email: "test@gmail.com",
      password: "password123",
      is_active: true,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });

    output = await useCase.execute({
      username: "test",
      email: "test@gmail.com",
      password: "password123",
      is_active: false,
    });

    entity = await repository.findById(new Uuid(output.id));

    expect(output).toStrictEqual({
      id: entity.user_id.id,
      username: "test",
      email: "test@gmail.com",
      password: "password123",
      is_active: false,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  });
});
