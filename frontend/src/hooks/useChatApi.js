import { useState, useCallback } from 'react';
import { chatService } from '../services/api';

export function useChatApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendPrompt = useCallback(async (history) => { // history — это массив сообщений
        setIsLoading(true);
        setError(null);

        try {
            const data = await chatService.sendMessage(history);
            return data.reply; // Возвращаем только текст ответа
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { isLoading, error, sendPrompt };
}