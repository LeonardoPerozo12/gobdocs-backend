export abstract class BaseRepository<
  TModel,
  TDelegate extends {
    create: (args: any) => Promise<TModel>;
    findMany: (args?: any) => Promise<TModel[]>;
    findUnique: (args: any) => Promise<TModel | null>;
    findFirst: (args: any) => Promise<TModel | null>; 
    update: (args: any) => Promise<TModel>;
    delete: (args: any) => Promise<TModel>;
  },
> {
  protected constructor(protected readonly delegate: TDelegate) {}

  // CREATE (post)
  async create(
    args: Parameters<TDelegate['create']>[0],
  ): Promise<TModel> {
    return this.delegate.create(args);
  }

  // READ MANY (get all)
  async findMany(
    args?: Parameters<TDelegate['findMany']>[0],
  ): Promise<TModel[]> {
    return this.delegate.findMany(args);
  }

  // READ FIRST (get first match)
  async findFirst(
    args: Parameters<TDelegate['findFirst']>[0],
  ) : Promise<TModel | null >{
    return this.delegate.findFirst(args)
  }

  // READ ONE (get by id)
  async findUnique(
    args: Parameters<TDelegate['findUnique']>[0],
  ): Promise<TModel | null> {
    return this.delegate.findUnique(args);
  }

  // UPDATE
  async update(
    args: Parameters<TDelegate['update']>[0],
  ): Promise<TModel> {
    return this.delegate.update(args);
  }

  // DELETE
  async delete(
    args: Parameters<TDelegate['delete']>[0],
  ): Promise<TModel> {
    return this.delegate.delete(args);
  }
}
