// test-clear-users.ts

import { BASE_URL } from "./config";

export async function testClearUsers() {
  // Call the clearusers endpoint
  const res = await fetch(`${BASE_URL}/clearusers`, {
    method: "DELETE",
  });

  if (!res.ok) {
    console.error("Failed to clear users:", await res.text());
    throw new Error("Clear users failed");
  }

  const data = await res.json();
  console.log("Clear Users Response:", data);

  // Verify that users are now empty by fetching the users list
  const usersRes = await fetch(`${BASE_URL}/users`);
  const users = await usersRes.json();
  console.log("Users after clearing:", users);
}

testClearUsers().catch(console.error);