require('dotenv').config();

const express = require('express');
const app = express();
const route53Routes = require('./routes/route53Routes');

app.use('/route53', route53Routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
