import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { getToken } from "next-auth/jwt";

const secret = process.env.SECRET;

export default async function handler(req, res) {
  const token = await getToken({ req, secret });

  let accessToken = token?.access_token;

  res.status(200).json(accessToken);
}
