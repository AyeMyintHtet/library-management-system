import { TWithStringIds } from '../../mongo/TWithStringIds'; 
import { BaseMongoEntityService } from '../../mongo/BaseMongoEntityService';
import { EMongoCollectionName } from '../../mongo/EMongoCollectionName';
import { IEntityAuth } from './IEntityAuth';
export class EntityAuthService extends BaseMongoEntityService<IEntityAuth> {
  public getAsClientEntity(
    entity: IEntityAuth
  ): TWithStringIds<IEntityAuth> {
    return {
      ...entity,
      // _id: entity._id.toString(),
    };
  }

  public getCollectionName(): EMongoCollectionName {
    return EMongoCollectionName.USER;
  }
}
