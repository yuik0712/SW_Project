// controllers/gptController.js
const { getGptResponse } = require('../models/gptModel');

// GPT 응답 요청을 처리하는 함수
const chatWithGpt = async (req, res) => {
    const { prompt } = req.body;

    try {
        const gptResponse = await getGptResponse(prompt);
        res.json({ response: gptResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'GPT 응답 요청에 실패했습니다.' });
    }
};

module.exports = {
    chatWithGpt,
};
