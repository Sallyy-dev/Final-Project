const request = require('supertest');
const app = require('../app');

jest.mock("../models/cateItem.js");
jest.mock('../controllers/cateItem.controller', () => ({
  getAllCateItems: (req, res) => res.status(200).json({ items: [] }),
  getCateItemById: (req, res) => res.status(200).json({ item: { id: req.params.id } }),
  deleteCateItem: (req, res) => res.status(200).json({ ok: true }),
  updateCateItem: (req, res) => res.status(200).json({ ok: true }),
  createCateItem: (req, res) => res.status(201).json({ id: 'i1' })
}));



describe('Cate Items', () => {
  test('Get all items', async () => {
    const res = await request(app).get('/cateItems/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
  });
});
