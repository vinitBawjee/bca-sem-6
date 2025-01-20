const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const connectDB = require('./config/db');
const homeRoutes = require('./routes/homeRoutes');
connectDB();

const app = express();
app.use(cors()); 
app.use(bodyParser.json());


app.use("/api/home", homeRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
