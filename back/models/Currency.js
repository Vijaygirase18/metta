const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  countries: [{
    name: {
      type: String,
      required: true
    },
    flag: {
      type: String,
      required: true
    },
    capital: {
      type: String,
      required: true
    }
  }]
});

const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;
