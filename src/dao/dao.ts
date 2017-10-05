import {
  Schema,
  model,
  Model,
  Document,
  ModelFindByIdAndUpdateOptions,
  ModelUpdateOptions,
  SchemaDefinition,
  connect
} from "mongoose";
import { promisify } from "util";
interface Modified {
  n: number
  ok: number
}
interface UpdateModified extends Modified {
  nModified: number
  nUpserted?: number
}
export interface FindOption {
  skip?: number
  limit?: number
  sort?: {
    [field: string]: number
  }
}
export class DAO<D extends Document> {
  private model: Model<D>
  private asyncFind: (
    cond: object,
    project: object,
    option: object
  ) => Promise<D[]>
  private asyncFindById: (
    id: string | object | number,
    project: object,
    option: object
  ) => Promise<D>
  private asyncFindByIdAndRemove: (
    id: string | object | number,
    option?: object
  ) => Promise<D | null>
  private asyncFindByIdAndUpdate: (
    id: string | object | number,
    update: object,
    option: ModelFindByIdAndUpdateOptions
  ) => Promise<D | null>
  private asyncUpdate: (
    cond: object,
    doc: object,
    options: ModelUpdateOptions
  ) => Promise<UpdateModified>
  private asyncCreate: (...docs: any[]) => Promise<D[] | D>
  private asyncRemove: (cond?: object) => Promise<{ result: Modified }>
  private asyncCount: (cond?: object) => Promise<number>

  constructor(collection: string, schema: Schema) {
    this.model = model(collection, schema)
    this.asyncFind = promisify<object, D[]>(this.model.find.bind(this.model))
    this.asyncFindById = promisify<string, D>(
      this.model.findById.bind(this.model)
    )
    this.asyncFindByIdAndRemove = promisify<string, D>(
      this.model.findByIdAndRemove.bind(this.model)
    )
    this.asyncFindByIdAndUpdate = promisify<string, D>(
      this.model.findByIdAndUpdate.bind(this.model)
    )
    this.asyncUpdate = promisify<object, UpdateModified>(
      this.model.update.bind(this.model)
    )
    this.asyncCreate = promisify(this.model.create.bind(this.model));
    this.asyncRemove = promisify<object, { result: Modified }>(
      this.model.remove.bind(this.model)
    )
    this.asyncCount = promisify<object, number>(this.model.count.bind(this.model))
  }
  public async find(
    condi: object,
    project?: object,
    option?: FindOption
  ): Promise<D[]> {
    return this.asyncFind(condi, project, option);
  }
  public async findById(
    id: string | number | object,
    project?: { [filed: string]: 0 | 1 },
    option?: FindOption
  ): Promise<D> {
    return this.asyncFindById(id, project, option);
  }
  public async findByIdAndRemove(
    id: string | number | object,
    option?: {
      sort?: object;
      select?: object;
    }
  ) {
    return this.asyncFindByIdAndRemove(id, option);
  }
  public async findByIdAndUpdate(
    id: string | number | object,
    update?: object,
    option?: ModelFindByIdAndUpdateOptions
  ) {
    return this.asyncFindByIdAndUpdate(id, update, option);
  }
  public async update(cond: object, doc: object, option?: ModelUpdateOptions) {
    const m = await this.asyncUpdate(cond, doc, option);
    if (m.nUpserted) {
      return m.nModified + m.nUpserted;
    } else {
      return m.nModified;
    }
  }
  public async create(...docs: any[]) {
    return this.asyncCreate(...docs);
  }
  public async add(doc: object) {
    return this.asyncCreate(doc) as Promise<D>;
  }

  public async remove(cond?: object): Promise<number> {
    return (await this.asyncRemove(cond)).result.n;
  }

  public async count(cond?: object) {
    return this.asyncCount(cond)
  }
}

export class DAOBase<T> extends DAO<T & Document> {
  constructor(collection: string, schema: SchemaDefinition) {
    super(collection, new Schema(schema));
  }
}
