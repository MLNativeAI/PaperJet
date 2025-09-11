import { db } from "./index";
import { configuration } from "./schema";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Insert basic configuration with default values
    const result = await db
      .insert(configuration)
      .values({
        modelType: "cloud",
      })
      .returning();

    console.log("✅ Successfully inserted configuration:", result[0]);
    console.log("🎉 Database seeding completed!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
