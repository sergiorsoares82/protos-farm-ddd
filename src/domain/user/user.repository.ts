import type { IRepository } from "../shared/repository-interface";
import type { Uuid } from "../shared/value-objects/uuid.vo";
import type { User } from "./user.entity";

export interface UserRepository extends IRepository<User, Uuid> {}
