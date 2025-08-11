// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("admin123", 10);

  await prisma.user.upsert({
    where: { username: "superadmin" },
    update: {},
    create: {
      username: "superadmin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });
  await prisma.unit.createMany({
    data: [
      { name: "Kilogram", abbreviation: "kg" },
      { name: "Liter", abbreviation: "l" },
      { name: "Piece", abbreviation: "pcs" },
      { name: "Meter", abbreviation: "m" },
    ],
    skipDuplicates: true, // avoids duplicate errors
  });

  // Categories
  await prisma.category.createMany({
    data: [{ name: "Fruits" }, { name: "Vegetables" }, { name: "Meat" }],
    skipDuplicates: true,
  });

  // Items (you must be sure unitId/categoryId exist and match)
  await prisma.item.createMany({
    data: [
      {
        name: "Apple",
        sku: "APPL",
        description: "Red Apple",
        itemType: "NORMAL",
        unitId: 1,
        categoryId: 1,
        barcode: "23847295",
        reorderLevel: "10", // Decimal as string
      },
      {
        name: "Orange",
        sku: "ORNG",
        description: "Orange",
        itemType: "NORMAL",
        unitId: 1,
        categoryId: 1,
        barcode: "928359238",
        reorderLevel: "10",
      },
      {
        name: "Banana",
        sku: "BNN",
        description: "Banana",
        itemType: "NORMAL",
        unitId: 1,
        categoryId: 1,
        barcode: "1298475853",
        reorderLevel: "10",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded admin user successfully!");
  console.log(await prisma.user.findMany());
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
