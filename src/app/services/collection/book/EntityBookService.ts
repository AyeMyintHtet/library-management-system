import { TWithStringIds } from '../../mongo/TWithStringIds'; 
import { BaseMongoEntityService } from '../../mongo/BaseMongoEntityService';
import { EMongoCollectionName } from '../../mongo/EMongoCollectionName';
import { IEntityBooks } from './IEntityBooks'; 

export class EntityBooksService extends BaseMongoEntityService<IEntityBooks> {
  public getAsClientEntity(
    entity: IEntityBooks
  ): TWithStringIds<IEntityBooks> {
    return {
      ...entity,
      // _id: entity._id.toString(),
    };
  }

  public getCollectionName(): EMongoCollectionName {
    return EMongoCollectionName.BOOK;
  }
}
