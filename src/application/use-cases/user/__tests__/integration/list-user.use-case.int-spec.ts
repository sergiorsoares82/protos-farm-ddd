import { User } from "../../../../../domain/user/user.entity";
import { UserSearchResult } from "../../../../../domain/user/user.repository";
import { UserInMemoryRepository } from "../../../../../infra/db/in-memory/user/user-in-memory.repository";
import { UserSequelizeRepository } from "../../../../../infra/db/sequelize/user/user-sequelize.repository";
import { UserModel } from "../../../../../infra/db/sequelize/user/user.model";
import { setupSequelize } from "../../../../../infra/shared/testing/helpers";
import { UserOutputMapper } from "../../common/user-output";
import { ListUserUseCase } from "../../list-user/list-user.use-case";

describe("ListUserUseCase Integration Test", () => {
  let useCase: ListUserUseCase;
  let repository: UserSequelizeRepository;

  setupSequelize({ models: [UserModel] });

  beforeEach(() => {
    repository = new UserSequelizeRepository(UserModel);
    useCase = new ListUserUseCase(repository);
  });

  describe("toOutput method should convert search result to output format", () => {
    it("should convert search result to output format", async () => {
      let result = new UserSearchResult({
        items: [],
        total: 1,
        current_page: 1,
        per_page: 2,
      });

      let output = useCase["toOutput"](result);
      expect(output).toStrictEqual({
        items: [],
        total: 1,
        current_page: 1,
        per_page: 2,
        last_page: 1,
      });

      const entity = User.create({
        username: "test",
        email: "test@gmail.com",
        password: "password123",
      });
      result = new UserSearchResult({
        items: [entity],
        total: 1,
        current_page: 1,
        per_page: 2,
      });

      output = useCase["toOutput"](result);
      expect(output).toStrictEqual({
        items: [entity].map(UserOutputMapper.toOutput),
        total: 1,
        current_page: 1,
        per_page: 2,
        last_page: 1,
      });
    });

    it("should return output sorted by created_at when input param is empty", async () => {
      const items = [
        new User({
          username: "test1",
          email: "test1@gmail.com",
          password: "password123",
        }),
        new User({
          username: "test2",
          email: "test2@gmail.com",
          password: "password123",
          created_at: new Date(new Date().getTime() + 100),
        }),
      ];
      await repository.bulkInsert(items);

      const output = await useCase.execute({});
      expect(output).toStrictEqual({
        items: [...items].reverse().map(UserOutputMapper.toOutput),
        total: 2,
        current_page: 1,
        per_page: 15,
        last_page: 1,
      });
    });

    it("should return output using pagination, sort and filter", async () => {
      const items = [
        new User({
          username: "aa",
          email: "test@gmail.com",
          password: "password123",
        }),
        new User({
          username: "AAA",
          email: "test@gmail.com",
          password: "password123",
        }),
        new User({
          username: "AaA",
          email: "test@gmail.com",
          password: "password123",
        }),
        new User({
          username: "b",
          email: "test@gmail.com",
          password: "password123",
        }),
        new User({
          username: "c",
          email: "test@gmail.com",
          password: "password123",
        }),
      ];
      await repository.bulkInsert(items);

      let output = await useCase.execute({
        page: 1,
        per_page: 2,
        sort: "username",
        filter: "a",
      });
      expect(output).toStrictEqual({
        items: [items[1], items[2]].map(UserOutputMapper.toOutput),
        total: 3,
        current_page: 1,
        per_page: 2,
        last_page: 2,
      });

      output = await useCase.execute({
        page: 2,
        per_page: 2,
        sort: "username",
        filter: "a",
      });
      expect(output).toStrictEqual({
        items: [items[0]].map(UserOutputMapper.toOutput),
        total: 3,
        current_page: 2,
        per_page: 2,
        last_page: 2,
      });

      output = await useCase.execute({
        page: 1,
        per_page: 2,
        sort: "username",
        sort_dir: "desc",
        filter: "a",
      });
      expect(output).toStrictEqual({
        items: [items[0], items[2]].map(UserOutputMapper.toOutput),
        total: 3,
        current_page: 1,
        per_page: 2,
        last_page: 2,
      });
    });
  });
});
