const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const currencyController = require('./controller/currencyController');

const app = express();
const PORT = process.env.PORT|| 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://vijayhgirase2000:mMsiHKLX8qnQzdc9@cluster0.psp71kz.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api', currencyController);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
