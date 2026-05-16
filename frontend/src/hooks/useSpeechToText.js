// hooks/useSpeechToText.js
import { useState, useEffect, useRef, useCallback } from 'react';

const getSpeechRecognition = () => {
    if (typeof window === 'undefined') return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition;
};

export function useSpeechToText(onTranscriptCallback) {
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState(() =>
        getSpeechRecognition() ? null : 'Web Speech API не поддерживается вашим браузером.'
    );

    const recognitionRef = useRef(null);
    const callbackRef = useRef(onTranscriptCallback);

    useEffect(() => {
        callbackRef.current = onTranscriptCallback;
    }, [onTranscriptCallback]);

    // 🔥 ДОБАВЛЯЕМ: Автоматический сброс ошибки через 5 секунд
    useEffect(() => {
        if (speechError) {
            const timer = setTimeout(() => {
                setSpeechError(null);
            }, 5000); // 5000 мс = 5 секунд
            return () => clearTimeout(timer);
        }
    }, [speechError]);

    useEffect(() => {
        const SpeechRecognition = getSpeechRecognition();
        if (!SpeechRecognition) return;

        if (!recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'ru-RU';
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsListening(true);
                setSpeechError(null);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (callbackRef.current) {
                    callbackRef.current(transcript);
                }
            };

            recognition.onerror = (event) => {
                if (event.error === 'not-allowed') {
                    setSpeechError('Микрофон заблокирован. Разрешите доступ в настройках браузера (иконка замочка у URL).');
                } else if (event.error !== 'no-speech') {
                    setSpeechError(`Ошибка записи: ${event.error}`);
                }
                setIsListening(false);
            };

            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) return;

        try {
            if (isListening) {
                recognitionRef.current.stop();
            } else {
                setSpeechError(null);
                recognitionRef.current.start();
            }
        } catch (err) {
            Console.error(err);
            setIsListening(false);
        }
    }, [isListening]);

    return { isListening, speechError, toggleListening, setSpeechError };
}