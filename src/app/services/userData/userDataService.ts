import { EntityAuthService } from "../collection/auth/EntityAuthService";
import { IEntityAuth, IReqAuth } from "../collection/auth/IEntityAuth";

export abstract class UserDataService {
  public static async genCreateUser(
    payload: IReqAuth
  ): Promise<IEntityAuth | string> {
    try {
      const createUser = new EntityAuthService();

      const checkUserExist = await createUser.genOne({ email: payload.email, password: payload.password });
      if (checkUserExist) return checkUserExist;

      if(payload.func === 'signup'){
        await createUser.genInsertOne(payload);
      }
      const obj = {
        ...payload,
        from : 'create'
      }
      return obj;
    } catch (error: any) {
      return error;
    }
  }

  public static async genLoginUser(): Promise<IEntityAuth[] | string> {
    const userCollection = new EntityAuthService();
    const userData = await userCollection.genMany({})
    return userData;

  }
}
