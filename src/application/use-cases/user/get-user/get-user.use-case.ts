import { NotFoundError } from "../../../domain/shared/errors/not-found.error";
import { Uuid } from "../../../domain/shared/value-objects/uuid.vo";
import { User } from "../../../domain/user/user.entity";
import type { IUserRepository } from "../../../domain/user/user.repository";
import type { IUseCase } from "../shared/use-case.interface";

export class GetUserUseCase implements IUseCase<GetUserInput, GetUserOutput> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserInput): Promise<GetUserOutput> {
    const uuid = new Uuid(input.id);
    const user = await this.userRepository.findById(uuid);
    if (!user) {
      throw new NotFoundError(uuid.id, User);
    }

    return {
      id: user.user_id.id,
      username: user.username,
      email: user.email,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}

export type GetUserInput = {
  id: string;
};

export type GetUserOutput = {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};
