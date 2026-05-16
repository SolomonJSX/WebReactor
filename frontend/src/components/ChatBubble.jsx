import React, { useState, useEffect, useRef } from 'react';

export function ChatBubble({ message, isLast }) {
    const isAi = message.role === 'ai';
    const [displayedText, setDisplayedText] = useState(isAi && isLast ? "" : message.content);
    const [isTyping, setIsTyping] = useState(isAi && isLast);
    const bubbleEndRef = useRef(null);

    useEffect(() => {
        // Анимируем только если это последнее сообщение от AI и текст еще не напечатан
        if (isAi && isLast && message.content !== displayedText) {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedText(message.content.slice(0, i + 1));
                i++;

                if (i >= message.content.length) {
                    clearInterval(interval);
                    setIsTyping(false);
                }
            }, 20); // Оптимальная скорость

            return () => clearInterval(interval);
        }
    }, [message.content, isAi, isLast]);

    // Скроллим родительский контейнер "вдогонку" за буквами
    useEffect(() => {
        if (isTyping && bubbleEndRef.current) {
            // ИСПОЛЬЗУЕМ "auto", чтобы не лагал скроллбар во время таймера
            bubbleEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
        }
    }, [displayedText, isTyping]);

    return (
        <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} w-full transition-all`}>
            <div className={`max-w-[80%] p-5 rounded-3xl shadow-lg ${
                isAi
                    ? 'bg-brand-input-bg ring-1 ring-brand-input-ring rounded-bl-none text-white/90'
                    : 'bg-brand-accent rounded-br-none text-white'
            }`}>
                <div className={`text-[10px] uppercase tracking-widest mb-2 opacity-50 font-bold ${!isAi && 'text-right'}`}>
                    {isAi ? 'AI Assistant' : 'You'}
                </div>

                <div className="text-base md:text-lg leading-relaxed whitespace-pre-line relative">
                    {displayedText}
                    {isTyping && (
                        <span className="inline-block w-2 h-4 ml-1 bg-white/50 animate-pulse align-middle" />
                    )}
                    {/* Маяк для отслеживания роста конкретного баббла */}
                    <div ref={bubbleEndRef} />
                </div>
            </div>
        </div>
    );
}