const client = require('../config/db');
const RESPONSE_MESSAGES = require('../message');

// Get User Profile
exports.getUserProfile = async (req, res) => {
  const userEmail = req.user.email;

  try {
    const result = await client.query('SELECT id, username, email FROM users WHERE email = $1', [userEmail]);
    
    if (result.rows.length === 0) {
      return res.status(STATUS_CODE.notfound).json({
        status: RESPONSE_STATUS.NOT_FOUND,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND
      });
    }

    const user = result.rows[0];
    res.status(200).json({
      userId: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error('Error fetching user profile', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
