const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../config/db');
const { INVALID_CREDENTIALS, UNAUTHORIZED_ACCESS } = require('../message');
const RESPONSE_MESSAGES = require('../message');

// Signup API
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  try {
    const emailCheckQuery = 'SELECT * FROM users WHERE email = $1';
    const emailCheckResult = await client.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `
      INSERT INTO users (username, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING id`;
    const result = await client.query(insertUserQuery, [username, email, hashedPassword]);

    const userId = result.rows[0].id;
    res.status(201).json({
      message: 'User created successfully',
      userId: userId.toString(),
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Login API
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await client.query(userQuery, [email]);
    if (userResult.rows.length === 0) {
      return {
        status:  RESPONSE_MESSAGES.UNAUTHORIZED,
        message: RESPONSE_MESSAGES.INVALID_CREDENTIALS,
      }; 
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      userId: user.id.toString(),
    });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
