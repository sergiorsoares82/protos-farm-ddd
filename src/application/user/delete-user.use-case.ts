import { Uuid } from "../../domain/shared/value-objects/uuid.vo";
import type { IUserRepository } from "../../domain/user/user.repository";
import type { IUseCase } from "../shared/use-case.interface";

export class DeleteUserUseCase
  implements IUseCase<DeleteUserInput, DeleteUserOutput>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const uuid = new Uuid(input.id);
    await this.userRepository.delete(uuid);
  }
}

export type DeleteUserInput = {
  id: string;
};

export type DeleteUserOutput = void;
