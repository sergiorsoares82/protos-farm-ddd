import { User } from "../../domain/user/user.entity";
import type { IUserRepository } from "../../domain/user/user.repository";
import type { IUseCase } from "../shared/use-case.interface";

export class CreateUserUseCase
  implements IUseCase<CreateUserInput, CreateUserOutput>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const entity = User.create(input);

    await this.userRepository.insert(entity);

    return {
      id: entity.user_id.id,
      username: entity.username,
      email: entity.email,
      password: entity.password,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
  is_active?: boolean;
};

export type CreateUserOutput = {
  id: string;
  username: string;
  email: string;
  password: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};
