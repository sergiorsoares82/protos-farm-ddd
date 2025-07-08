import { Uuid } from "../../shared/value-objects/uuid.vo";
import { User } from "../user.entity";

describe("User Unit Tests", () => {
  // let validate: jest.SpyInstance;

  beforeEach(() => {
    // User.prototype.validate = jest.spyOn(User, "validate");
    User.prototype.validate = jest
      .fn()
      .mockImplementation(User.prototype.validate);
  });
  describe("constructor", () => {
    it("should create a user with default values", () => {
      const user = new User({
        username: "john_doe",
        email: "john.doe@gmail.com",
        password: "secure_password",
      });

      expect(user.user_id).toBeInstanceOf(Uuid);
      expect(user.username).toBe("john_doe");
      expect(user.email).toBe("john.doe@gmail.com");
      expect(user.password).toBe("secure_password");
      expect(user.is_active).toBe(true);
      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.updated_at).toBeInstanceOf(Date);
    });

    it("should create a user with provided values", () => {
      const createdAt = new Date("2023-01-01T00:00:00Z");
      const updatedAt = new Date("2023-01-02T00:00:00Z");

      const user = new User({
        user_id: new Uuid(),
        username: "jane_doe",
        email: "jane.doe@gmail.com",
        password: "secure_password",
        is_active: false,
        created_at: createdAt,
        updated_at: updatedAt,
      });

      expect(user.user_id).toBeInstanceOf(Uuid);
      expect(user.username).toBe("jane_doe");
      expect(user.email).toBe("jane.doe@gmail.com");
      expect(user.password).toBe("secure_password");
      expect(user.is_active).toBe(false);
      expect(user.created_at).toBe(createdAt);
      expect(user.updated_at).toBe(updatedAt);
    });
  });

  describe("create method", () => {
    it("should create a user using the create method", () => {
      const user = User.create({
        username: "john_doe",
        email: "john.doe@gmail.com",
        password: "secure_password",
      });

      expect(user.user_id).toBeInstanceOf(Uuid);
      expect(user.username).toBe("john_doe");
      expect(user.email).toBe("john.doe@gmail.com");
      expect(user.password).toBe("secure_password");
      expect(user.is_active).toBe(true);
      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.updated_at).toBeInstanceOf(Date);
      expect(User.prototype.validate).toHaveBeenCalledTimes(1);
    });

    it("should create a user with is_active set to true", () => {
      const user = User.create({
        username: "john_doe",
        email: "john.doe@gmail.com",
        password: "secure_password",
        is_active: true,
      });

      expect(user.is_active).toBe(true);
      expect(User.prototype.validate).toHaveBeenCalledTimes(1);
    });
  });

  describe("operations methods", () => {
    it("should change username", () => {
      const user = new User({
        username: "john_doe",
        email: "john.doe@gmail.com",
        password: "secure_password",
      });

      user.changeUserName("john_doe_updated");
      expect(user.username).toBe("john_doe_updated");
      expect(user.updated_at).toBeInstanceOf(Date);
      expect(User.prototype.validate).toHaveBeenCalledTimes(1);
    });
  });

  describe("user_id field", () => {
    it("should create user_id field when null is received", () => {
      const uuid = null as any;

      const user = new User({
        user_id: uuid as any,
        username: "john.doe",
        email: "john.doe@gmail.com",
        password: "secure_password",
      });

      expect(user.user_id).toBeInstanceOf(Uuid);
    });

    it("should create user_id field when undefined is received", () => {
      const uuid = undefined as any;

      const user = new User({
        user_id: uuid,
        username: "john.doe",
        email: "john.doe@gmail.com",
        password: "secure_password",
      });

      expect(user.user_id).toBeInstanceOf(Uuid);
    });

    it("should create user_id field when uuid is received", () => {
      const uuid = new Uuid();

      const user = new User({
        user_id: uuid,
        username: "john.doe",
        email: "john.doe@gmail.com",
        password: "secure_password",
      });

      expect(user.user_id).toBeInstanceOf(Uuid);
    });
  });

  describe("validate method", () => {
    it("should invalidate a user with empty username", () => {
      const user = User.create({
        username: "t".repeat(256),
        email: "test@gmail.com",
        password: "secure_password",
      });

      expect(user.notification.hasErrors()).toBe(true);
      expect(user.notification).notificationContainsErrorMessages([
        {
          username: [
            "username must be shorter than or equal to 255 characters",
          ],
        },
      ]);
    });
  });
});
