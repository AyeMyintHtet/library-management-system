import { AnyBulkWriteOperation, ObjectId } from "mongodb";
import { TWithStringIds } from "../mongo/TWithStringIds";
import { EntityBooksService } from "../collection/book/EntityBookService";
import { IEntityBooks } from "../collection/book/IEntityBooks";

export abstract class BookDataService {
  public static async genGetAllBook(): Promise<IEntityBooks[]> {
    const booksEntityService = new EntityBooksService();
    const books = await booksEntityService.genMany({});
    return books;
  }

  public static async genCreateBook(data : IEntityBooks): Promise<IEntityBooks> {
    const booksEntityService = new EntityBooksService();
    const obj: IEntityBooks = {
      bookName: data.bookName,
      bookDescription: data.bookDescription,
      aldyBorrowed: data.aldyBorrowed,
    };
    await booksEntityService.genInsertOne(obj);
    return obj;
  }
  public static async genUpdateBook(data : IEntityBooks,_id : ObjectId): Promise<IEntityBooks> {
    const booksEntityService = new EntityBooksService();
    const bookCheck = await booksEntityService.genOne({
      bookName : data.bookName,
      bookDescription: data.bookDescription
    })
    const operation = [
      {
        updateOne: {
          filter: { _id : bookCheck?._id},
          update: {
            $set: {
              aldyBorrowed : data.aldyBorrowed,
            },
          },
        },
      },
    ];
    const result =await booksEntityService.genBulkWrite(operation);
    return data;
  }
  
}
