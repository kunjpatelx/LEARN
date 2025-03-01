async function getLLMResponse(topic, prompt) {
    try {
        const response = await fetch('/api/llm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, prompt })
        });
        const data = await response.json();
        return data.text || 'Error fetching response.';
    } catch (error) {
        return `Error: ${error.message}`;
    }
}
