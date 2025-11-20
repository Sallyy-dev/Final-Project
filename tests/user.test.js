const request = require("supertest");
const app = require("../app");


jest.mock("../models/user.js");


jest.mock('../controllers/user.controller.js', () => ({
  Register: (req, res) => {
    return res.status(201).json({ token: 'fake-jwt-token', user: { id: 'u1', userName: req.body.userName || 'noName' } });
  },
  Login: (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      return res.status(200).json({ token: 'fake-jwt-token' });
    }
    return res.status(400).json({ message: 'Missing credentials' });
  },
  Logout: (req, res) => res.status(200).json({ message: 'Logged out' }),
  forgetPassword: (req, res) => res.status(200).json({ message: 'ok' }),
  resetPassword: (req, res) => res.status(200).json({ message: 'ok' }),
  getProfile: (req, res) => res.status(200).json({ user: { id: 'u1', userName: 'Sally' } })
}));


describe('User API Tests', () => {
  test('Register user -> should return 201 and token', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({
        userName: 'sally',              
        email: 'sally@mail.com',
        password: 'Abcd1234!',
        confirmPassword: 'Abcd1234!'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  test('Login user should return 200 and token', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({
        email: 'sally@mail.com',
        password: 'Abcd1234!'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
