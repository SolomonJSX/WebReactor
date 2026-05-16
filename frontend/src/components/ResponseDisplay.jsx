import React, { useState, useEffect, useRef } from 'react';

export function ResponseDisplay({ response, isLoading, error }) {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null); // Реф для автоскролла

    // Эффект печати (ваш исправленный)
    useEffect(() => {
        if (!response) {
            setDisplayedText("");
            return;
        }
        setDisplayedText("");
        setIsTyping(true);
        let i = 0;
        const typingInterval = setInterval(() => {
            setDisplayedText(response.slice(0, i + 1));
            i++;
            if (i >= response.length) {
                clearInterval(typingInterval);
                setIsTyping(false);
            }
        }, 20);
        return () => clearInterval(typingInterval);
    }, [response]);

    // Автоскролл вниз при изменении текста
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [displayedText, isLoading]);

    if (!response && !isLoading && !error) return null;

    return (
        <div className="w-full bg-brand-input-bg ring-1 ring-brand-input-ring rounded-3xl p-8 transition-all shadow-2xl">
            {/* Thinking... и ошибки остаются такими же */}
            {isLoading && (
                <div className="flex items-center space-x-3 text-brand-muted mb-4">
                    <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce"></div>
                    <p className="italic text-lg ml-2">Thinking...</p>
                </div>
            )}

            {error && (
                <div className="p-5 bg-red-500/10 border border-red-500/50 text-red-300 rounded-xl text-lg flex items-center gap-3">
                    {/* SVG иконка ошибки */}
                    <span>{error}</span>
                </div>
            )}

            {!isLoading && response && (
                <div className="prose prose-invert max-w-none text-white/90 text-lg leading-relaxed whitespace-pre-line relative">
                    {displayedText}
                    {isTyping && (
                        <span className="inline-block w-2 h-5 ml-1 bg-brand-accent animate-pulse align-middle" />
                    )}
                    {/* Невидимый элемент, к которому будет скроллиться экран */}
                    <div ref={scrollRef} />
                </div>
            )}
        </div>
    );
}