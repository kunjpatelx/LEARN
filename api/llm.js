const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {
    const { topic, prompt } = req.body;
    try {
        if (!topic || !prompt) {
            return res.status(400).json({ error: 'Topic and prompt are required.' });
        }
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful learning assistant.' },
                { role: 'user', content: `${prompt} about ${topic}` }
            ],
            max_tokens: 300 // Increased for longer schedules
        });
        res.status(200).json({ text: completion.choices[0].message.content.trim() });
    } catch (error) {
        console.error('OpenAI Error:', error);
        res.status(500).json({ error: error.message || 'Failed to generate response. Check API key or limits.' });
    }
};
