// test-api.ts

import { BASE_URL } from "./config";
import { testClearUsers } from "./clear_users"

async function createUser(newUser: { id: number; name: string; email: string }) {
  const createRes = await fetch(`${BASE_URL}/createuser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });
  const data = await createRes.json();
  console.log("Create User Response:", data);

  return data;
}

async function testAPI() {

  // Clear users before testing
  await console.log("Clearing users.json")
  await testClearUsers();

  // User payload
  const newUser = {
    id: 1,
    name: "Alice Bun",
    email: "alice@example.com",
  };

  const secondUser = {
    id: 2,
    name: "Melicia Bun",
    email: "melicia@example.com",
  };

  // 1. Create user
  await createUser(newUser).catch(console.error);
  await createUser(secondUser).catch(console.error);

  // try the existing user error
  await console.log("try exisiting user")
  await createUser(newUser).catch(console.error);
  

  // 2. Get users
  const usersRes = await fetch(`${BASE_URL}/users`);
  const users = await usersRes.json();
  console.log("📃 All Users:", users);

  // 3. Update user
  const updatedUser = {
    id: 1,
    name: "Alice Bun Updated",
    email: "alice.updated@example.com",
  };

  const updateRes = await fetch(`${BASE_URL}/updateuser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser),
  });
  console.log("🔁 Update User Response:", await updateRes.json());

  // 4. Delete user
  const deletedUser = {
    id: 1,
    name: "Alice Bun Updated",
    email: "alice.updated@example.com",
  };

  const deleteRes = await fetch(`${BASE_URL}/deleteuser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(deletedUser),
  });
  console.log("🗑️ Delete User Response:", await deleteRes.json());
}

testAPI().catch(console.error);
