const { faker } = require('@faker-js/faker');
const bcrypt = require("bcrypt");
const { hash } = bcrypt;

const generateUsers = async () => {
  let users = [];
  for (let id = 1; id <= 10; id++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const username = `${firstName}${lastName}${id}`;
    const password = 'password';
    const passwordHash = await hash(password, 12);
    users.push({
      id: id,
      firstName: firstName,
      lastName: lastName,
      username: username,
      passwordHash: passwordHash,
    })
  }
  return users;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  const users = await generateUsers();
  await knex('users').insert(users);
};
