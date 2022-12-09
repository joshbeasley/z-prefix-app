const { faker } = require('@faker-js/faker');

const generateItems = () => {
  let items = [];
  for (let id = 1; id <= 50; id++) {
    const userId = faker.datatype.number({
      'min': 1,
      'max': 10
    });
    const itemName = faker.commerce.product();
    const description = faker.lorem.words(20);
    const quantity = faker.datatype.number({
      'min': 1,
      'max': 20
    });
    items.push({
      id: id,
      userId: userId,
      itemName: itemName,
      description: description,
      quantity: quantity
    })
  }
  return items;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('items').del()
  const items = generateItems();
  await knex('items').insert(items);
};
