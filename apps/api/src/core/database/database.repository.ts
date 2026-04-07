import { Knex } from 'knex';

export abstract class BaseRepository<T> {
  constructor(
    protected readonly db: Knex,
    protected readonly tableName: string,
  ) {}

  protected getQueryBuilder(trx?: Knex.Transaction) {
    return trx
      ? this.db(this.tableName).transacting(trx)
      : this.db(this.tableName);
  }

  async create(data: Partial<T>, trx?: Knex.Transaction): Promise<T> {
    const rows = await this.getQueryBuilder(trx).insert(data).returning('*');

    return rows[0] as T;
  }

  async findAll<K extends keyof T>(
    where: Partial<T>,
    columns: K[],
  ): Promise<Pick<T, K>[]>;

  async findAll(where?: Partial<T>): Promise<T[]>;

  async findAll(
    where: Partial<T> = {},
    columns: (keyof T | '*')[] = ['*'],
    trx?: Knex.Transaction,
  ): Promise<any[]> {
    return this.getQueryBuilder(trx).where(where).select(columns);
  }

  async findOne<K extends keyof T>(
    where: Partial<T>,
    columns: K[],
  ): Promise<Pick<T, K> | undefined>;

  async findOne(where: Partial<T>): Promise<T | undefined>;

  async findOne(
    where: Partial<T>,
    columns: (keyof T | '*')[] = ['*'],
    trx?: Knex.Transaction,
  ): Promise<any> {
    const rows = await this.getQueryBuilder(trx).where(where).select(columns);

    return rows[0] as T;
  }

  async update(
    where: Partial<T>,
    data: Partial<T>,
    trx?: Knex.Transaction,
  ): Promise<T | undefined> {
    const rows = await this.getQueryBuilder(trx)
      .where(where)
      .update(data)
      .returning('*');

    return rows[0] as T;
  }

  async delete(where: Partial<T>, trx?: Knex.Transaction): Promise<boolean> {
    const count = await this.getQueryBuilder(trx).where(where).delete();

    return count > 0;
  }

  async count(where: Partial<T> = {}, trx?: Knex.Transaction): Promise<number> {
    const rows = await this.getQueryBuilder(trx)
      .where(where)
      .count({ count: '*' })
      .first();

    return Number(rows?.count || 0);
  }
}
