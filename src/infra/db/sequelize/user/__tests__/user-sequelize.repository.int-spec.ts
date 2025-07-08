import { Sequelize } from "sequelize-typescript";
import { UserSequelizeRepository } from "../user-sequelize.repository";
import { UserModel } from "../user.model";
import { User } from "../../../../../domain/user/user.entity";
import { Uuid } from "../../../../../domain/shared/value-objects/uuid.vo";
import { NotFoundError } from "../../../../../domain/shared/errors/not-found.error";
import { UserModelMapper } from "../user-model-mapper";
import {
  UserSearchParams,
  UserSearchResult,
} from "../../../../../domain/user/user.repository";
import { setupSequelize } from "../../../../shared/testing/helpers";

describe("UserSequelizeRepository Integration Tests", () => {
  // let sequelize: Sequelize;
  let repository: UserSequelizeRepository;
  setupSequelize({ models: [UserModel] });

  beforeEach(async () => {
    // sequelize = new Sequelize({
    //   dialect: "sqlite",
    //   storage: ":memory:",
    //   logging: false,
    //   models: [UserModel],
    // });
    // await sequelize.sync();
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

  describe("search", () => {
    it("should apply pagination only when other params are null", async () => {
      const created_at = new Date();
      const users = User.fake()
        .theUsers(16)
        .withUsername("username test")
        .withCreatedAt(created_at)
        .build();

      await repository.bulkInsert(users);

      const spyToEntity = jest.spyOn(UserModelMapper, "toEntity");

      const searchOutput = await repository.search(new UserSearchParams());
      expect(searchOutput).toBeInstanceOf(UserSearchResult);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });

      searchOutput.items.forEach((user) => {
        expect(user).toBeInstanceOf(User);
        expect(user.user_id).toBeDefined();
      });

      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          username: "username test",
          created_at: created_at,
        })
      );
    });

    it("should sort by created_at DESC when other params are null", async () => {
      const created_at = new Date();
      const users = User.fake()
        .theUsers(16)
        .withUsername((index) => `username test ${index}`)
        .withCreatedAt((index) => new Date(created_at.getTime() - index * 1000))
        .build();

      const searchOutput = await repository.search(new UserSearchParams());
      const items = searchOutput.items;
      [...items].reverse().forEach((user, index) => {
        expect(user.username).toBe(`username test ${index}`);
        expect(user.created_at.getTime()).toBe(
          created_at.getTime() - index * 1000
        );
      });
    });

    it("should apply pagination and filter", async () => {
      const users = [
        User.fake()
          .aUser()
          .withUsername("test")
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        User.fake()
          .aUser()
          .withUsername("a")
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        User.fake()
          .aUser()
          .withUsername("TEST")
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        User.fake()
          .aUser()
          .withUsername("TeSt")
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];

      await repository.bulkInsert(users);

      let searchOutput = await repository.search(
        new UserSearchParams({
          page: 1,
          per_page: 2,
          filter: "TEST",
        })
      );

      expect(searchOutput.toJSON(true)).toMatchObject(
        new UserSearchResult({
          items: [users[0], users[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true)
      );

      searchOutput = await repository.search(
        new UserSearchParams({
          page: 2,
          per_page: 2,
          filter: "TEST",
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new UserSearchResult({
          items: [users[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }).toJSON(true)
      );
    });

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual([
        "username",
        "created_at",
      ]);

      const users = [
        User.fake().aUser().withUsername("b").build(),
        User.fake().aUser().withUsername("a").build(),
        User.fake().aUser().withUsername("d").build(),
        User.fake().aUser().withUsername("e").build(),
        User.fake().aUser().withUsername("c").build(),
      ];

      await repository.bulkInsert(users);

      const arrange = [
        // {
        //   params: new UserSearchParams({
        //     page: 1,
        //     per_page: 2,
        //     sort: "username",
        //   }),
        //   result: new UserSearchResult({
        //     items: [users[1], users[0]],
        //     total: 5,
        //     current_page: 1,
        //     per_page: 2,
        //   }),
        // },
        {
          params: new UserSearchParams({
            page: 2,
            per_page: 2,
            sort: "username",
          }),
          result: new UserSearchResult({
            items: [users[4], users[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          params: new UserSearchParams({
            page: 1,
            per_page: 2,
            sort: "username",
            sort_dir: "desc",
          }),
          result: new UserSearchResult({
            items: [users[3], users[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new UserSearchParams({
            page: 2,
            per_page: 2,
            sort: "username",
            sort_dir: "desc",
          }),
          result: new UserSearchResult({
            items: [users[4], users[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(i.params);
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
      }
    });

    describe("should apply paginate, sort and filter", () => {
      const users = [
        User.fake().aUser().withUsername("test").build(),
        User.fake().aUser().withUsername("a").build(),
        User.fake().aUser().withUsername("TEST").build(),
        User.fake().aUser().withUsername("e").build(),
        User.fake().aUser().withUsername("TeSt").build(),
      ];

      const arrange = [
        {
          search_params: new UserSearchParams({
            page: 1,
            per_page: 2,
            sort: "username",
            filter: "TEST",
          }),
          search_result: new UserSearchResult({
            items: [users[2], users[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new UserSearchParams({
            page: 2,
            per_page: 2,
            sort: "username",
            filter: "TEST",
          }),
          search_result: new UserSearchResult({
            items: [users[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(users);
      });

      test.each(arrange)(
        "when value is $search_params",
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        }
      );
    });
  });
});
