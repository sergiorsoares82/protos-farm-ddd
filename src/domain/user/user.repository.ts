import type { ISearchableRepository } from "../shared/repository/repository-interface";
import { SearchParams } from "../shared/repository/search-params";
import { SearchResult } from "../shared/repository/search-result";
import type { Uuid } from "../shared/value-objects/uuid.vo";
import type { User } from "./user.entity";

export type UserFilter = string;

export class UserSearchParams extends SearchParams<UserFilter> {}

export class UserSearchResult extends SearchResult<User> {}

export interface IUserRepository
  extends ISearchableRepository<
    User,
    Uuid,
    UserFilter,
    UserSearchParams,
    UserSearchResult
  > {}
