import React from 'react';

const MicrophoneIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
);

const ArrowRightIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);

export function ChatInput({
                              text,
                              setText,
                              isLoading,
                              isListening,
                              onSendMessage,
                              onToggleListening
                          }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() || isLoading) return;
        onSendMessage();
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            {/* Главный контейнер ввода */}
            <div className="relative flex items-center bg-brand-input-bg ring-2 ring-brand-input-ring rounded-2xl p-1.5 shadow-inner transition-all focus-within:ring-brand-accent/50 focus-within:bg-brand-input-bg/70">

                {/* Кнопка микрофона */}
                <button
                    type="button"
                    onClick={onToggleListening}
                    disabled={isLoading}
                    className={`flex items-center justify-center rounded-xl p-3 transition-all shrink-0 ${
                        isListening
                            ? 'bg-red-500 text-white animate-pulse shadow-lg'
                            : 'text-brand-muted hover:text-white hover:bg-white/5'
                    } disabled:opacity-30`}
                    title={isListening ? 'Идет запись...' : 'Включить голосовой ввод'}
                >
                    <MicrophoneIcon className="w-6 h-6" />
                </button>

                {/* Само поле ввода: flex-1 заставляет его занять всё свободное место, а min-w-0 предотвращает распирание контентом */}
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ask whatever you want"
                    disabled={isLoading}
                    className="flex-1 min-w-0 bg-transparent border-0 pl-4 pr-3 text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-0 text-lg disabled:text-brand-muted/70"
                />

                {/* Кнопка отправки внутри контейнера */}
                <button
                    type="submit"
                    disabled={isLoading || !text.trim()}
                    className="flex items-center justify-center rounded-xl bg-brand-accent p-3 text-white hover:bg-brand-accent/80 disabled:bg-brand-input-ring disabled:text-brand-muted transition-all shrink-0"
                >
                    <ArrowRightIcon className="w-6 h-6" />
                </button>
            </div>
        </form>
    );
}