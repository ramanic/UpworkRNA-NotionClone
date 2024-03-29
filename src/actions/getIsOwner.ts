import "server-only";
import { prisma } from "@/lib/db";

export async function getIsOwner(id: string, ownerId: number) {
  const count = await prisma.document.count({
    where: {
      id,
      ownerId,
    },
  });
  return count !== 0;
}
