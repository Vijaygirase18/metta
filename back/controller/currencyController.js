const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch'); 
const Currency = require('../models/Currency');

router.post('/search', async (req, res) => {
    const { code } = req.body;
    try {
        const response = await fetch(`https://restcountries.com/v3.1/currency/${code}`);
        const data = await response.json();

        if (!response.ok || !Array.isArray(data) || data.length === 0) {
            return res.status(404).json({ error: `No countries found for currency code ${code}.` });
        }

        const countries = await Promise.all(data.map(async (country) => {
            let flag = null;
            let capital = null;

            if (country.flags) {
                flag = country.flags.png;
            } else {
                const flagResponse = await fetch(`https://flagsapi.com/api/v1/flag?name=${country.name.common}`);
                if (flagResponse.ok) {
                    const { flag: flagImage } = await flagResponse.json();
                    flag = flagImage;
                } else {
                    const flagCodeResponse = await fetch('https://flagcdn.com/en/codes.json');
                    if (flagCodeResponse.ok) {
                        const flagCodeData = await flagCodeResponse.json();
                        const countryCode = flagCodeData[country.name.common];
                        flag = `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
                    }
                }
            }

            if (country.capital) {
                capital = country.capital[0];
            }

            return {
                name: country.name.common,
                flag,
                capital
            };
        }));

        await Currency.findOneAndUpdate(
            { code },
            { code, countries },
            { upsert: true, new: true }
        );

        return res.json({ countries });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;
