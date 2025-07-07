import { User } from "../../../../domain/user/user.entity";
import { UserInMemoryRepository } from "../user-in-memory.repository";

describe("UserInMemoryRepository", () => {
  let repository: UserInMemoryRepository;

  beforeEach(() => (repository = new UserInMemoryRepository()));
  it("should no filter items when filter object is null", async () => {
    const items = [
      User.create({
        username: "test",
        email: "test@test.com",
        password: "123",
      }),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items using filter parameter", async () => {
    const items = [
      new User({ username: "test", email: "test@test.com", password: "123" }),
      new User({ username: "TEST", email: "test@test.com", password: "123" }),
      new User({ username: "fake", email: "test@test.com", password: "123" }),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, "TEST");
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it("should sort by created_at when sort param is null", async () => {
    const created_at = new Date();

    const items = [
      new User({
        username: "test",
        email: "test@test.com",
        password: "123",
        created_at,
      }),
      new User({
        username: "TEST",
        email: "test@test.com",
        password: "123",
        created_at: new Date(created_at.getTime() + 100),
      }),
      new User({
        username: "fake",
        email: "test@test.com",
        password: "123",
        created_at: new Date(created_at.getTime() + 200),
      }),
    ];

    const itemsSorted = await repository["applySort"](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it("should sort by name", async () => {
    const items = [
      User.create({ username: "c", email: "john@gmail.com", password: "123" }),
      User.create({ username: "b", email: "john@gmail.com", password: "123" }),
      User.create({ username: "a", email: "john@gmail.com", password: "123" }),
    ];

    let itemsSorted = await repository["applySort"](items, "username", "asc");
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository["applySort"](items, "name", "desc");
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
