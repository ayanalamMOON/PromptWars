/**
 * Seed script for development/testing.
 * Populates the database with sample tournament data.
 *
 * Usage: npx ts-node scripts/seed.ts
 */

// TODO: Import database connection and models
// import { connectDB } from "../lib/db/connection";
// import { User } from "../lib/db/models/User";
// import { Tournament } from "../lib/db/models/Tournament";
// import { Problem } from "../lib/db/models/Problem";

async function seed() {
    console.log("Seeding database...");

    // TODO: Connect to database
    // await connectDB();

    // TODO: Create sample tournament
    // const tournament = await Tournament.create({ ... });

    // TODO: Create sample problems for each round
    // const problems = await Problem.insertMany([ ... ]);

    // TODO: Create sample users (players + admin)
    // const users = await User.insertMany([ ... ]);

    console.log("Seeding complete.");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
