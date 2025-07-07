import { Entity } from "../../../domain/shared/entity";
import { NotFoundError } from "../../../domain/shared/errors/not-found.error";
import { Uuid } from "../../../domain/shared/value-objects/uuid.vo";
import { InMemoryRepository } from "../in-memory.repository";

type StubEntityConstructor = {
  entity_id?: Uuid;
  prop1: string;
  prop2: number;
};

class StubEntity extends Entity {
  entity_id: Uuid;
  prop1: string;
  prop2: number;

  constructor(props: StubEntityConstructor) {
    super();
    this.entity_id = props.entity_id ?? new Uuid();
    this.prop1 = props.prop1;
    this.prop2 = props.prop2;
  }

  toJSON() {
    return {
      entity_id: this.entity_id.id,
      prop1: this.prop1,
      prop2: this.prop2,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe("InMemoryRepository Unit Tests", () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it("should insert an entity", async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      prop1: "test",
      prop2: 123,
    });

    await repository.insert(entity);

    expect(repository.items).toHaveLength(1);
    expect(repository.items[0]).toEqual(entity);
  });

  it("should bulk insert entities", async () => {
    const entities = [
      new StubEntity({ entity_id: new Uuid(), prop1: "test1", prop2: 123 }),
      new StubEntity({ entity_id: new Uuid(), prop1: "test2", prop2: 456 }),
    ];
    await repository.bulkInsert(entities);
    expect(repository.items).toHaveLength(2);
    expect(repository.items).toEqual(expect.arrayContaining(entities));
  });

  it("should update an entity", async () => {
    const entity = new StubEntity({ prop1: "test", prop2: 123 });
    await repository.insert(entity);
    entity.prop1 = "updated";
    await repository.update(entity);
    expect(repository.items[0].prop1).toBe("updated");
  });

  it("should throw NotFoundError when updating a non-existing entity", async () => {
    const entity = new StubEntity({ prop1: "test", prop2: 123 });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    );
  });

  it("should delete an entity", async () => {
    const entity = new StubEntity({ prop1: "test", prop2: 123 });
    await repository.insert(entity);
    await repository.delete(entity.entity_id);
    expect(repository.items).toHaveLength(0);
  });

  it("should throw NotFoundError when deleting a non-existing entity", async () => {
    const entityId = new Uuid();
    await expect(repository.delete(entityId)).rejects.toThrow(
      new NotFoundError(entityId, StubEntity)
    );
  });

  it("should find an entity by ID", async () => {
    const entity = new StubEntity({ prop1: "test", prop2: 123 });
    await repository.insert(entity);
    const foundEntity = await repository.findById(entity.entity_id);
    expect(foundEntity).toEqual(entity);
  });
});
