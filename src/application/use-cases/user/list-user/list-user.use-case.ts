import type { SortDirection } from "../../../domain/shared/repository/search-params";
import {
  UserSearchParams,
  type IUserRepository,
  type UserFilter,
  type UserSearchResult,
} from "../../../domain/user/user.repository";
import {
  PaginationOutputMapper,
  type PaginationOutput,
} from "../shared/pagination-output";
import type { IUseCase } from "../shared/use-case.interface";
import { UserOutputMapper, type UserOutput } from "./common/user-output";

export class ListUserUseCase
  implements IUseCase<ListUsersInput, ListUsersOutput>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
    const params = new UserSearchParams(input);
    const searchResult = await this.userRepository.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: UserSearchResult): ListUsersOutput {
    const { items: _items } = searchResult;
    const items = _items.map((item) => UserOutputMapper.toOutput(item));
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListUsersInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: UserFilter | null;
};

export type ListUsersOutput = PaginationOutput<UserOutput>;
