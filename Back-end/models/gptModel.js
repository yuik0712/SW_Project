const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const askGPT = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',  // 사용하는 모델에 따라 변경 가능
            messages: [{ role: 'user', content: prompt }],
        });
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        throw new Error('GPT API 호출에 실패했습니다.');
    }
};

module.exports = {
    askGPT,
};