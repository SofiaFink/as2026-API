const bcrypt = require('bcryptjs');

const passwordHash = bcrypt.hashSync('Password123!', 10);

const users = [
  {
    id: 1,
    name: 'Alice Rivera',
    email: 'alice@shop.test',
    passwordHash
  },
  {
    id: 2,
    name: 'Bob Chen',
    email: 'bob@shop.test',
    passwordHash
  },
  {
    id: 3,
    name: 'Carol Diaz',
    email: 'carol@shop.test',
    passwordHash
  }
];

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Over-ear Bluetooth headphones with 30-hour battery life',
    price: 100
  },
  {
    id: 2,
    name: 'USB-C Cable',
    description: '2-meter braided USB-C charging cable',
    price: 15
  },
  {
    id: 3,
    name: 'Ceramic Coffee Mug',
    description: '350ml ceramic mug',
    price: 20
  }
];

const carts = {};

function nextUserId() {
  return users.reduce((max, user) => Math.max(max, user.id), 0) + 1;
}

function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
}

function findUserById(id) {
  return users.find((user) => user.id === id);
}

function findProductById(id) {
  return products.find((product) => product.id === Number(id));
}

function getCart(userId) {
  if (!carts[userId]) {
    carts[userId] = { items: [] };
  }
  return carts[userId];
}

function setCart(userId, items) {
  carts[userId] = { items };
  return carts[userId];
}

module.exports = {
  users,
  products,
  carts,
  nextUserId,
  findUserByEmail,
  findUserById,
  findProductById,
  getCart,
  setCart
};
