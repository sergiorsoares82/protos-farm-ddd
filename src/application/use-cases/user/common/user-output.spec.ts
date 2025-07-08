import { User } from "../../../../domain/user/user.entity";
import { UserOutputMapper } from "./user-output";

describe("UserOutputMapper Unit Test", () => {
  it("should convert a User entity to UserOutput", () => {
    const user = User.create({
      username: "testuser",
      email: "testuser@gmail.com",
      password: "password123",
    });
    const spyToJSON = jest.spyOn(user, "toJSON");

    const output = UserOutputMapper.toOutput(user);

    expect(spyToJSON).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: user.user_id.id,
      username: user.username,
      email: user.email,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  });
});
