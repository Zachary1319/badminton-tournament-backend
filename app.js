const express = require('express');
const cors = require('cors');
const app = express();
const matchRoutes = require('./routes/matchRoutes');

app.use(express.json());
app.use(cors());
app.use(matchRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
