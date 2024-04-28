import { IEntityBooks } from "@/app/services/collection/book/IEntityBooks";
import { BookDataService } from "@/app/services/bookData/BookDataService";
import { NextRequest, NextResponse } from "next/server";

export async function GET():Promise<Response>{
    const books = await BookDataService.genGetAllBook()
    return NextResponse.json(books,{status:200})
}

export async function POST(req:NextRequest):Promise<Response>{
    const data : IEntityBooks = await req.json();
    const book = await BookDataService.genCreateBook(data)
    return NextResponse.json(book,{status:200})
}

export async function PATCH(req:NextRequest):Promise<Response>{
    const data : IEntityBooks = await req.json();
    const book = await BookDataService.genUpdateBook(data,data._id)
    return NextResponse.json(book,{status:200})
}