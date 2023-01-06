import { Model } from "mongoose";
import { PaginatorInputModel, SortDirection } from "./query-params.model";

export class GetItems<T> {
  whereCondition: Array<{ [key: string]: { $in: { posts } } }> = [];

  private model: Model<T>;

  private page: number = 1;
  private size: number = 10;
  private skip: number = (this.page - 1) * this.size;
  private sort: string = 'createdAt';
  private sortDirection: SortDirection = SortDirection.DESC;
  private filter;
  private totalCount = 0;

  constructor(model: Model<T>, query?: PaginatorInputModel) {
    this.model = model;
    this.page = Number(query.pageNumber);
    this.size = Number(query.pageSize);
    this.sort = query.sortBy;
    this.sortDirection = query.sortDirection;
    this.filter = this.model.find();
  }

  private getFilter(): any {
    if (this.whereCondition.length > 0) {
      this.filter.and(this.whereCondition);
    }
  }

  private sortItems() {
    this.sortDirection === SortDirection.DESC
      ? (this.sort = `-${this.sort}`)
      : this.sort;
  }

  private getSort(): string {
    this.sortItems();
    return this.sort;
  }

  public addCondition(condition: { [key: string]: { $in: { posts } } }): void {
    this.whereCondition.push(condition);
  }

  public getPages(): number {
    return this.page;
  }

  public getSize(): number {
    return this.size;
  }

  public async getItems(): Promise<T[]> {
    this.totalCount = await this.model.count(this.getFilter());
    return await this.model
      .find(this.getFilter())
      .skip(this.skip)
      .sort(this.getSort())
      .limit(this.size)
      .exec();
  }

  public getTotalCount(): number {
    return this.totalCount;
  }
}