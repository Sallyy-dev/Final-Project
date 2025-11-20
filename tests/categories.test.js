const request = require("supertest");
const app = require("../app");


jest.mock("../models/categories.js");

jest.mock('../controllers/category.controller', () => ({
  getCateTypes: (req, res) => res.status(200).json({ types: ['Books', 'Shoes'] }),
  searchCateType: (req, res) => res.status(200).json({ results: [] }),
  getItemsByType: (req, res) => res.status(200).json({ items: [] }),
  addCategory: (req, res) => res.status(201).json({ id: 'c1' })
}));


describe('Category Routes', () => {
  test('Get Category Types', async () => {
    const res = await request(app).get('/cate/cate-types');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('types');
  });
});
