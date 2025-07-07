import { Op } from "sequelize";
import type { Entity } from "../../../../domain/shared/entity";
import type { SearchParams } from "../../../../domain/shared/repository/search-params";
import type { SearchResult } from "../../../../domain/shared/repository/search-result";
import { Uuid } from "../../../../domain/shared/value-objects/uuid.vo";
import { User } from "../../../../domain/user/user.entity";
import {
  IUserRepository,
  UserSearchParams,
  UserSearchResult,
} from "../../../../domain/user/user.repository";
import type { UserModel } from "./user.model";
import { NotFoundError } from "../../../../domain/shared/errors/not-found.error";
import { UserModelMapper } from "./user-model-mapper";

export class UserSequelizeRepository implements IUserRepository {
  sortableFields: string[] = ["username", "created_at"];

  constructor(private userModel: typeof UserModel) {}

  async search(props: UserSearchParams): Promise<UserSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const { rows: models, count } = await this.userModel.findAndCountAll({
      ...(props.filter && {
        where: {
          username: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: [[props.sort, props.sort_dir]] }
        : { order: [["created_at", "desc"]] }),
      offset,
      limit,
    });
    return new UserSearchResult({
      items: models.map((model) => {
        return UserModelMapper.toEntity(model);
        // return new User({
        //   user_id: new Uuid(model.user_id),
        //   username: model.username,
        //   email: model.email,
        //   password: model.password,
        //   is_active: model.is_active,
        //   created_at: model.created_at,
        //   updated_at: model.updated_at,
        // });
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  async insert(entity: User): Promise<void> {
    const modelProps = UserModelMapper.toModel(entity);
    await this.userModel.create(modelProps.toJSON());
    // await this.userModel.create({
    //   user_id: entity.user_id.id,
    //   username: entity.username,
    //   email: entity.email,
    //   password: entity.password,
    //   is_active: entity.is_active,
    //   created_at: entity.created_at,
    //   updated_at: entity.updated_at,
    // });
  }

  async bulkInsert(entities: User[]): Promise<void> {
    const modelsProps = entities.map((entity) =>
      UserModelMapper.toModel(entity).toJSON()
    );

    await this.userModel.bulkCreate(modelsProps);
    // Uncomment the following code if you want to use the commented version
    // await this.userModel.bulkCreate(
    //   entities.map((entity) => ({
    //     user_id: entity.user_id.id,
    //     username: entity.username,
    //     email: entity.email,
    //     password: entity.password,
    //     is_active: entity.is_active,
    //     created_at: entity.created_at,
    //     updated_at: entity.updated_at,
    //   }))
    // );
  }

  async update(entity: User): Promise<void> {
    const id = entity.user_id.id;
    const model = await this._get(id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    const modelProps = UserModelMapper.toModel(entity);
    await this.userModel.update(modelProps.toJSON(), {
      where: { user_id: id },
    });
    // await this.userModel.update(
    //   {
    //     user_id: entity.user_id.id,
    //     username: entity.username,
    //     email: entity.email,
    //     password: entity.password,
    //     is_active: entity.is_active,
    //     created_at: entity.created_at,
    //     updated_at: entity.updated_at,
    //   },
    //   { where: { user_id: id } }
    // );
  }

  async delete(entity_id: Uuid): Promise<void> {
    const id = entity_id.id;
    const model = await this._get(id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }
    await this.userModel.destroy({ where: { user_id: id } });
  }

  async findById(entity_id: Uuid): Promise<User> {
    const user = await this._get(entity_id.id);

    if (!user) {
      return null;
    }

    return new User({
      user_id: new Uuid(user.user_id),
      username: user.username,
      email: user.email,
      password: user.password,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.findAll();

    return users.map((user) => {
      return new User({
        user_id: new Uuid(user.user_id),
        username: user.username,
        email: user.email,
        password: user.password,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });
    });
  }
  getEntity(): new (...args: any[]) => User {
    return User;
  }

  private async _get(id: string) {
    return await this.userModel.findByPk(id);
  }
}
