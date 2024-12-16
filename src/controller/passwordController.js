const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const client = require('../config/db');
const sendEmail = require('../helpers/sendEmail');

// Password Reset Request
exports.passwordResetRequest = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `http://localhost:${process.env.PORT}/api/password-reset/${token}`;

    await sendEmail(email, 'Password Reset Request', `Click the link to reset your password: ${resetLink}`);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Error sending password reset email', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

// Password Reset
exports.passwordReset = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(STATUS_CODE.notfound).json({
        status: RESPONSE_STATUS.NOT_FOUND,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error resetting password', err);
    res.status(400).json({ error: 'Invalid token' });
  }
};
