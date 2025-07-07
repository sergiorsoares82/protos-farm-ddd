import { Chance } from "chance";
import { Uuid } from "../../shared/value-objects/uuid.vo";
import { UserFakeBuilder } from "../user-fake.builder";

describe("CategoryFakerBuilder Unit Tests", () => {
  describe("user_id prop", () => {
    const faker = UserFakeBuilder.aUser();

    test("should throw error when any with methods has called", () => {
      expect(() => faker.user_id).toThrow(
        new Error("Property user_id not have a factory, use 'with' methods")
      );
    });

    test("should be undefined", () => {
      expect(faker["_user_id"]).toBeUndefined();
    });

    test("withUuid", () => {
      const user_id = new Uuid();
      const $this = faker.withUuid(user_id);
      expect($this).toBeInstanceOf(UserFakeBuilder);
      expect(faker["_user_id"]).toBe(user_id);

      faker.withUuid(() => user_id);
      //@ts-expect-error _user_id is a callable
      expect(faker["_user_id"]()).toBe(user_id);

      expect(faker.user_id).toBe(user_id);
    });

    //TODO - melhorar este nome
    test("should pass index to user_id factory", () => {
      let mockFactory = jest.fn(() => new Uuid());
      faker.withUuid(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);

      const categoryId = new Uuid();
      mockFactory = jest.fn(() => categoryId);
      const fakerMany = UserFakeBuilder.theUsers(2);
      fakerMany.withUuid(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].user_id).toBe(categoryId);
      expect(fakerMany.build()[1].user_id).toBe(categoryId);
    });
  });

  describe("username prop", () => {
    const faker = UserFakeBuilder.aUser();
    test("should be a function", () => {
      expect(typeof faker["_username"]).toBe("function");
    });

    test("should call the word method", () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, "word");
      faker["chance"] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test("withUsername", () => {
      const $this = faker.withUsername("test username");
      expect($this).toBeInstanceOf(UserFakeBuilder);
      expect(faker["_username"]).toBe("test username");

      faker.withUsername(() => "test username");
      //@ts-expect-error username is callable
      expect(faker["_username"]()).toBe("test username");

      expect(faker.username).toBe("test username");
    });

    test("should pass index to username factory", () => {
      faker.withUsername((index) => `test username ${index}`);
      const user = faker.build();
      expect(user.username).toBe(`test username 0`);

      const fakerMany = UserFakeBuilder.theUsers(2);
      fakerMany.withUsername((index) => `test username ${index}`);
      const users = fakerMany.build();

      expect(users[0].username).toBe(`test username 0`);
      expect(users[1].username).toBe(`test username 1`);
    });

    test("invalid too long case", () => {
      const $this = faker.withInvalidUsernameTooLong();
      expect($this).toBeInstanceOf(UserFakeBuilder);
      expect(faker["_username"].length).toBe(256);

      const tooLong = "a".repeat(256);
      faker.withInvalidUsernameTooLong(tooLong);
      expect(faker["_username"].length).toBe(256);
      expect(faker["_username"]).toBe(tooLong);
    });
  });

  describe("email prop", () => {
    const faker = UserFakeBuilder.aUser();
    test("should be a function", () => {
      expect(typeof faker["_email"]).toBe("function");
    });

    test("should call the paragraph method", () => {
      const chance = Chance();
      const spyParagraphMethod = jest.spyOn(chance, "email");
      faker["chance"] = chance;
      faker.build();
      expect(spyParagraphMethod).toHaveBeenCalled();
    });

    test("withPassword", () => {
      const $this = faker.withPassword("test description");
      expect($this).toBeInstanceOf(UserFakeBuilder);
      expect(faker["_password"]).toBe("test description");

      faker.withPassword(() => "test description");
      //@ts-expect-error description is callable
      expect(faker["_password"]()).toBe("test description");

      expect(faker.password).toBe("test description");
    });

    test("should pass index to description factory", () => {
      faker.withPassword((index) => `test password ${index}`);
      const user = faker.build();
      expect(user.password).toBe(`test password 0`);

      const fakerMany = UserFakeBuilder.theUsers(2);
      fakerMany.withPassword((index) => `test password ${index}`);
      const users = fakerMany.build();

      expect(users[0].password).toBe(`test password 0`);
      expect(users[1].password).toBe(`test password 1`);
    });
  });

  describe("is_active prop", () => {
    const faker = UserFakeBuilder.aUser();
    test("should be a function", () => {
      expect(typeof faker["_is_active"]).toBe("function");
    });

    test("activate", () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(UserFakeBuilder);
      expect(faker["_is_active"]).toBe(true);
      expect(faker.is_active).toBe(true);
    });

    test("deactivate", () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(UserFakeBuilder);
      expect(faker["_is_active"]).toBe(false);
      expect(faker.is_active).toBe(false);
    });
  });

  describe("created_at prop", () => {
    const faker = UserFakeBuilder.aUser();

    test("should throw error when any with methods has called", () => {
      const fakerCategory = UserFakeBuilder.aUser();
      expect(() => fakerCategory.created_at).toThrow(
        new Error("Property created_at not have a factory, use 'with' methods")
      );
    });

    test("should be undefined", () => {
      expect(faker["_created_at"]).toBeUndefined();
    });

    test("withCreatedAt", () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(UserFakeBuilder);
      expect(faker["_created_at"]).toBe(date);

      faker.withCreatedAt(() => date);
      //@ts-expect-error _created_at is a callable
      expect(faker["_created_at"]()).toBe(date);
      expect(faker.created_at).toBe(date);
    });

    test("should pass index to created_at factory", () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const category = faker.build();
      expect(category.created_at.getTime()).toBe(date.getTime() + 2);

      const fakerMany = UserFakeBuilder.theUsers(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const users = fakerMany.build();

      expect(users[0].created_at.getTime()).toBe(date.getTime() + 2);
      expect(users[1].created_at.getTime()).toBe(date.getTime() + 3);
    });
  });

  test("should create a user", () => {
    const faker = UserFakeBuilder.aUser();
    let user = faker.build();

    expect(user.user_id).toBeInstanceOf(Uuid);
    expect(typeof user.username === "string").toBeTruthy();
    expect(typeof user.email === "string").toBeTruthy();
    expect(typeof user.password === "string").toBeTruthy();
    expect(user.is_active).toBe(true);
    expect(user.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    const user_id = new Uuid();
    user = faker
      .withUuid(user_id)
      .withUsername("username test")
      .withEmail("username.test@gmail.com")
      .withPassword("password test")
      .deactivate()
      .withCreatedAt(created_at)
      .build();

    expect(user.user_id.id).toBe(user_id.id);
    expect(user.username).toBe("username test");
    expect(user.email).toBe("username.test@gmail.com");
    expect(user.password).toBe("password test");
    expect(user.is_active).toBe(false);
    expect(user.created_at).toBe(created_at);
  });

  test("should create many users", () => {
    const faker = UserFakeBuilder.theUsers(2);
    let users = faker.build();

    users.forEach((category) => {
      expect(category.user_id).toBeInstanceOf(Uuid);
      expect(typeof category.username === "string").toBeTruthy();
      expect(typeof category.email === "string").toBeTruthy();
      expect(typeof category.password === "string").toBeTruthy();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });

    const created_at = new Date();
    const user_id = new Uuid();
    users = faker
      .withUuid(user_id)
      .withUsername("username test")
      .withEmail("description test")
      .withPassword("password test")
      .deactivate()
      .withCreatedAt(created_at)
      .build();

    users.forEach((user) => {
      expect(user.user_id.id).toBe(user_id.id);
      expect(user.username).toBe("username test");
      expect(user.email).toBe("description test");
      expect(user.password).toBe("password test");
      expect(user.is_active).toBe(false);
      expect(user.created_at).toBe(created_at);
    });
  });
});
