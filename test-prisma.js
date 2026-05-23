import prisma from "./src/app/prisma/client.js";

async function test() {
  console.log("Testing Prisma Client");
  try {
    const conv = await prisma.conversation.create({
      data: {
        userId: "8ee58ec0-ce95-4ad0-aee1-54de72602e2b",
        name: "Test Chat",
        type: "SALES_BOT",
      }
    });
    console.log("Success:", conv);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    process.exit();
  }
}

test();
