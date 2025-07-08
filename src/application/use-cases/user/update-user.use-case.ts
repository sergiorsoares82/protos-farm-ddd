import { Not } from "sequelize-typescript";
import { Uuid } from "../../../domain/shared/value-objects/uuid.vo";
import type { IUserRepository } from "../../../domain/user/user.repository";
import type { IUseCase } from "../shared/use-case.interface";
import { User } from "../../../domain/user/user.entity";
import { NotFoundError } from "../../../domain/shared/errors/not-found.error";

export class UpdateUserUseCase
  implements IUseCase<UpdateUserInput, UpdateUserOutput>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const uuid = new Uuid(input.id);
    const user = await this.userRepository.findById(uuid);

    if (!user) {
      throw new NotFoundError(input.id, User);
    }

    if (input.username !== undefined) {
      user.changeUserName(input.username);
    }
    if (input.email !== undefined) {
      user.changeEmail(input.email);
    }
    if (input.password !== undefined) {
      user.changePassword(input.password);
    }
    if (input.is_active !== undefined) {
      if (input.is_active) {
        user.activate();
      } else {
        user.deactivate();
      }
    }

    await this.userRepository.update(user);

    return {
      id: user.user_id.id,
      username: user.username,
      email: user.email,
      password: user.password,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}

export type UpdateUserInput = {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
};

export type UpdateUserOutput = {
  id: string;
  username: string;
  email: string;
  password: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};
