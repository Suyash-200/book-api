const express = require("express");
const app = express();
const connectDB = require("./config/database");
const dotenv = require("dotenv");
const cors = require("cors");

const bookRoutes = require("./routes/book.route");
const userRoutes = require("./routes/user.route");
const auth = require("./middleware/auth");

dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Public routes
app.use('/api/users', userRoutes);

// Protected routes
app.use('/api/books', auth, bookRoutes);

// Database
connectDB();

app.get('/', (req, res) => {
    res.json('Hello Express!');
});

app.listen(PORT, () => {
    console.log(`Successfully connected to ${PORT}`);
});