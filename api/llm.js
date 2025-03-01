const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {
    const { topic, prompt } = req.body;
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful learning assistant.' },
                { role: 'user', content: `${prompt} about ${topic}` }
            ],
            max_tokens: 150
        });
        res.status(200).json({ text: completion.choices[0].message.content.trim() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
