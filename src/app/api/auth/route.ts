import { IEntityAuth, IReqAuth } from "@/app/services/collection/auth/IEntityAuth";
import { UserDataService } from "@/app/services/userData/userDataService";
import { NextApiRequest } from "next";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<Response> {

  const data : IReqAuth = await req.json();
  const result = await UserDataService.genCreateUser(data);
  return Response.json(result, { status: 200 });
}

export async function GET(): Promise<Response> {
  const result = await UserDataService.genLoginUser();
  return Response.json(result, { status: 200 });
}
