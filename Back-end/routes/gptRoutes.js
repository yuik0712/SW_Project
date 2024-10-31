const express = require('express');
const { askGPT } = require('../controllers/gptController');

const router = express.Router();

router.post('/gpt', async (req, res) => {
    const { prompt } = req.body;

    try {
        const gptResponse = await askGPT(prompt);
        res.json({ answer: gptResponse });
    } catch (error) {
        res.status(500).json({ error: 'Failed to communicate with GPT' });
    }
});

module.exports = router;
