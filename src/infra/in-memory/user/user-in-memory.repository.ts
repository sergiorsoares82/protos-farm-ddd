import type { SortDirection } from "../../../domain/shared/repository/search-params";
import { Uuid } from "../../../domain/shared/value-objects/uuid.vo";
import { User } from "../../../domain/user/user.entity";
import {
  InMemorySearchableRepository
} from "../in-memory.repository";

export class UserInMemoryRepository extends InMemorySearchableRepository<
  User,
  Uuid
> {
  sortableFields: string[] = ["username", "created_at"];

  protected async applyFilter(items: User[], filter: string): Promise<User[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.username.toLowerCase().includes(filter.toLowerCase());
    });
  }
  getEntity(): new (...args: any[]) => User {
    return User;
  }

  protected applySort(
    items: User[],
    sort: string | null,
    sort_dir: SortDirection | null
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, "created_at", "desc");
  }
}
