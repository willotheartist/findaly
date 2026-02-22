import { prisma } from "../../lib/db";

async function main() {
  const id = process.argv[2] || "eyb_001";
  const l = await prisma.listing.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      features: true,
      videoUrl: true,
      media: { take: 3, orderBy: { sort: "asc" }, select: { url: true, sort: true } },
    },
  });

  console.log(JSON.stringify(l, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});