import { db } from "../../db";
import { tasks } from "../../db/schema";

export default async (req: Request) => {
  const { title } = await req.json();

  const result = await db.insert(tasks).values({
    title,
  }).returning();

  return Response.json(result);
};