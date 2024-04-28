import { TWithStringIds } from '../../mongo/TWithStringIds';
import { ObjectId } from 'mongodb';


export interface IEntityAuth {
  _id?: ObjectId;
  email: string;
  password: string;
  fullName:string;
}
export interface IReqAuth extends IEntityAuth {
  func : 'login' | 'signup'| "librian"
}
export type TEntityAuthClient = TWithStringIds<IEntityAuth>;
