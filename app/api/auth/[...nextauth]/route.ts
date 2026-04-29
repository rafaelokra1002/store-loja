import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth";

const buildHandler = () => NextAuth(getAuthOptions());

export async function GET(request: Request, context: any) {
	return buildHandler()(request, context);
}

export async function POST(request: Request, context: any) {
	return buildHandler()(request, context);
}
