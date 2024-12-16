const express = require('express');
const { passwordResetRequest, passwordReset } = require('../controller/passwordController');
const router = express.Router();

router.post('/password-reset', passwordResetRequest);
router.post('/password-reset/:token', passwordReset);

module.exports = router;
