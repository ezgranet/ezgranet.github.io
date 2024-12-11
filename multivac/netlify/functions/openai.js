const axios = require('axios');

exports.handler = async function (event, context) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    try {
        const { message } = JSON.parse(event.body);

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }]
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: response.data.choices[0].message.content })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch response from OpenAI' })
        };
    }
};
