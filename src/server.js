const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON request body
app.use(bodyParser.urlencoded({ extended: true }));

// Registering routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', passwordRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
