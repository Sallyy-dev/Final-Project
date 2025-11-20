const request = require('supertest');
const app = require('../app');
jest.mock("../models/order.js");

jest.mock('../controllers/order.controller', () => ({
  createOrder: (req, res) => res.status(201).json({ id: 'o1' }),
  getAllOrders: (req, res) => res.status(200).json({ orders: [] }),
  getMyOrders: (req, res) => res.status(200).json({ orders: [] }),
  updateOrderStatus: (req, res) => res.status(200).json({ ok: true }),
  cancelOrder: (req, res) => res.status(200).json({ ok: true })
}));



describe('Orders API', () => {
  test('Should block creating order without token (401)', async () => {
    const res = await request(app)
      .post('/order/')
      .send({ items: [] });
    expect(res.statusCode).toBe(401);
  });
});
