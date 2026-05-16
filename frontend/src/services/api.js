const API_BASE_URL = import.meta.env.PROD
    ? 'https://webreactor-ai-api.onrender.com/api'
    : '/api';

export const chatService = {
    async sendMessage(messages, signal) {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: messages.map(m => ({
                    role: m.role,
                    content: m.content
                }))
            }),
            signal
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.errorMessage || 'Ошибка сервера');
        return data;
    }
};