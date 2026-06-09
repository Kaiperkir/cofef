import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, Send, Coffee } from 'lucide-react';

export default function AIBarista() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Привет! Я ваш ИИ-бариста. Расскажите, какой кофе вам по вкусу, или что бы вы хотели попробовать сегодня?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage })
      });
      
      const data = await res.json();
      if (res.ok && data.recommendation) {
        setMessages(prev => [...prev, { role: 'ai', text: data.recommendation }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'Извините, сейчас я слишком занят приготовлением других заказов. Попробуйте позже!' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Ошибка соединения. Моя кофемашина сломалась :(' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-16 h-16 bg-[#C06334] dark:bg-[#D4AF37] text-white dark:text-[#1C1614] rounded-full shadow-2xl flex items-center justify-center z-50 transition-all ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <MessageCircle className="w-8 h-8" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-white dark:bg-[#1C1614] border border-[#EADFD8] dark:border-[#4A3B32] rounded-[30px] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#EADFD8] dark:border-[#4A3B32] bg-stone-50 dark:bg-[#2A201D] flex justify-between items-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C06334]/10 dark:bg-[#D4AF37]/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-[#C06334] dark:bg-[#D4AF37] text-white dark:text-[#1C1614] rounded-full flex items-center justify-center shadow-md">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif italic text-lg leading-none">Gemini Бариста</h3>
                  <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold mt-1">AI Ассистент</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-[#362A25] transition-colors relative z-10 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-[#F6F1E9]/50 dark:bg-[#140F0D]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-[24px] text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#C06334] dark:bg-[#D4AF37] text-white dark:text-[#1C1614] rounded-br-sm shadow-md' 
                      : 'bg-white dark:bg-[#2A201D] text-stone-800 dark:text-stone-200 border border-[#EADFD8] dark:border-[#4A3B32] rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#2A201D] border border-[#EADFD8] dark:border-[#4A3B32] p-4 rounded-[24px] rounded-bl-sm flex gap-1 items-center h-[52px]">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-[#C06334] dark:bg-[#D4AF37] rounded-full opacity-60" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-[#C06334] dark:bg-[#D4AF37] rounded-full opacity-60" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-[#C06334] dark:bg-[#D4AF37] rounded-full opacity-60" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-[#1C1614] border-t border-[#EADFD8] dark:border-[#4A3B32]">
              <form onSubmit={sendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Что вам посоветовать?..."
                  className="w-full bg-stone-50 dark:bg-[#2A201D] py-3 pl-4 pr-12 rounded-full border border-transparent focus:border-[#C06334] dark:focus:border-[#D4AF37] text-sm outline-none transition-all dark:text-stone-200"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 w-8 h-8 bg-[#C06334] dark:bg-[#D4AF37] text-white dark:text-[#1C1614] rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
