import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@example.com").trim().toLowerCase();
  const name = (process.env.SEED_ADMIN_NAME || "Admin").trim();
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  if (!email || !name || !password) {
    throw new Error("Missing seed credentials. Check SEED_ADMIN_EMAIL, SEED_ADMIN_NAME, SEED_ADMIN_PASSWORD");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      passwordHash,
      isActive: true
    },
    update: {
      name,
      passwordHash,
      isActive: true
    }
  });

  console.log(`Seeded admin user: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
