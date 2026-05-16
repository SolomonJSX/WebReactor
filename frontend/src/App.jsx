import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatInput } from './components/ChatInput';
import { useChatApi } from './hooks/useChatApi';
import { useSpeechToText } from './hooks/useSpeechToText';
import { ChatBubble } from "./components/ChatBubble.jsx";

function App() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  const { isLoading, error, sendPrompt } = useChatApi();

  // Реф для отслеживания низа контейнера сообщений
  const messagesEndRef = useRef(null);

  const handleTranscript = useCallback((transcript) => {
    setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  }, []);

  const { isListening, toggleListening, speechError, setSpeechError } = useSpeechToText(handleTranscript);

  // Функция плавного скролла для новых сообщений
  const scrollToBottomSmooth = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  // Скроллим вниз каждый раз, когда добавляется новое сообщение или включается "Thinking..."
  useEffect(() => {
    scrollToBottomSmooth();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!text.trim() || isLoading) return;

    if (setSpeechError) setSpeechError(null);

    const userMessage = {
      role: 'user',
      content: text,
      id: Date.now()
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setText('');

    const aiReply = await sendPrompt(updatedHistory);

    if (aiReply) {
      const aiMessage = {
        role: 'ai',
        content: aiReply,
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const activeError = error || speechError;

  return (
      <div className="h-screen bg-brand-blue text-brand-text flex flex-col items-center overflow-hidden font-sans">
        <div className="w-full max-w-5xl flex flex-col h-full p-6 md:p-10">

          <div className="shrink-0 mb-8">
            <Header />
          </div>

          {/* ЧИСТЫЙ КОНТЕЙНЕР СООБЩЕНИЙ (Без плашек ошибок внутри) */}
          <div className="grow overflow-y-auto custom-scrollbar pr-2 mb-6">
            <div className="flex flex-col gap-6">
              {messages.map((msg, index) => (
                  <ChatBubble
                      key={msg.id}
                      message={msg}
                      isLast={index === messages.length - 1}
                  />
              ))}

              {isLoading && (
                  <div className="self-start bg-brand-input-bg rounded-2xl p-4 animate-pulse">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* НИЖНЯЯ ЧАСТЬ: Поле ввода + Абсолютное уведомление над ним */}
          <div className="shrink-0 w-full max-w-4xl self-center pb-4 relative">

            {/* Элегантный всплывающий Toast над инпутом */}
            {activeError && (
                <div className="absolute bottom-full left-0 right-0 mb-3 mx-auto max-w-md bg-red-500/90 backdrop-blur-md text-white text-sm py-2.5 px-4 rounded-xl shadow-2xl flex items-center justify-between transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 z-50">
                  <div className="flex items-center gap-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0 text-red-100">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="font-medium">{activeError}</span>
                  </div>

                  {/* Кнопка закрытия вручную */}
                  <button
                      onClick={() => { if (setSpeechError) setSpeechError(null); }}
                      className="text-white/60 hover:text-white text-xs ml-3 p-1 hover:bg-white/10 rounded-lg transition-all"
                  >
                    ✕
                  </button>
                </div>
            )}

            <ChatInput
                text={text}
                setText={setText}
                isLoading={isLoading}
                isListening={isListening}
                onSendMessage={handleSendMessage}
                onToggleListening={toggleListening}
            />
          </div>
        </div>
      </div>
  );
}

export default App;