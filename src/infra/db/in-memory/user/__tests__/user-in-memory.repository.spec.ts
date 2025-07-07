import { User } from "../../../../../domain/user/user.entity";
import { UserInMemoryRepository } from "../user-in-memory.repository";

describe("UserInMemoryRepository", () => {
  let repository: UserInMemoryRepository;

  beforeEach(() => (repository = new UserInMemoryRepository()));
  it("should no filter items when filter object is null", async () => {
    const items = [User.fake().aUser().build()];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items using filter parameter", async () => {
    const items = [
      User.fake().aUser().withUsername("test").build(),
      User.fake().aUser().withUsername("TEST").build(),
      User.fake().aUser().withUsername("fake").build(),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, "TEST");
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it("should sort by created_at when sort param is null", async () => {
    const created_at = new Date();

    const items = [
      User.fake()
        .aUser()
        .withUsername("test")
        .withCreatedAt(created_at)
        .build(),
      User.fake()
        .aUser()
        .withUsername("TEST")
        .withCreatedAt(new Date(created_at.getTime() + 100))
        .build(),
      User.fake()
        .aUser()
        .withUsername("fake")
        .withCreatedAt(new Date(created_at.getTime() + 200))
        .build(),
    ];

    const itemsSorted = await repository["applySort"](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it("should sort by name", async () => {
    const items = [
      User.fake().aUser().withUsername("c").build(),
      User.fake().aUser().withUsername("b").build(),
      User.fake().aUser().withUsername("a").build(),
    ];

    let itemsSorted = await repository["applySort"](items, "username", "asc");
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository["applySort"](items, "name", "desc");
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
