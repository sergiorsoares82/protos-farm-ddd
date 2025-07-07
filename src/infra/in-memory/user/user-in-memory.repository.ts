import { Uuid } from "../../../domain/shared/value-objects/uuid.vo";
import { User } from "../../../domain/user/user.entity";
import { InMemoryRepository } from "../in-memory.repository";

export class UserInMemoryRepository extends InMemoryRepository<User, Uuid> {
  getEntity(): new (...args: any[]) => User {
    return User;
  }
}
