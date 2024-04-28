import { TWithStringIds } from '../../mongo/TWithStringIds';
import { ObjectId } from 'mongodb';


export interface IEntityBooks {
  _id?: any;
  bookName: string;
  bookDescription: string;
  aldyBorrowed: string | '';
}

export type TEntityBooksClient = TWithStringIds<IEntityBooks>;
