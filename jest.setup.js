require('dotenv').config();
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect((process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)).replace('<USERNAME>', process.env.DATABASE_USERNAME), {
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
