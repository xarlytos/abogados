import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Bot, User, 
  Clock, ChevronRight, Sparkles
} from 'lucide-react';

interface Message {
  id: number;
  type: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

const quickReplies = [
  '¿Cómo empiezo?',
  'Ver precios',
  'Agendar demo',
  'Soporte técnico'
];

const initialMessages: Message[] = [
  {
    id: 1,
    type: 'bot',
    text: '¡Hola! 👋 Soy el asistente virtual de DerechoGo. ¿En qué puedo ayudarte hoy?',
    timestamp: new Date()
  }
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        '¿cómo empiezo?': '¡Excelente pregunta! Para empezar, puedes registrarte para una prueba gratuita de 14 días. No se requiere tarjeta de crédito. ¿Te gustaría que te envíe un enlace?',
        'ver precios': 'Tenemos planes desde €29/mes. El plan más popular es Professional a €79/mes. ¿Te gustaría ver una comparativa completa?',
        'agendar demo': '¡Perfecto! Puedo conectarte con nuestro equipo de ventas para una demo personalizada. ¿Qué día te viene mejor?',
        'soporte técnico': 'Entiendo que necesitas ayuda técnica. Para soporte prioritario, te recomiendo contactar a support@derechogo.com o usar el chat en tu panel.',
        'default': 'Gracias por tu mensaje. Para darte una mejor respuesta, ¿podrías indicarme si buscas información sobre precios, funcionalidades, soporte o una demo?'
      };

      const lowerText = text.toLowerCase();
      const botResponse = botResponses[lowerText] || botResponses['default'];

      const botMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent text-theme-secondary rounded-full shadow-lg shadow-accent/25 flex items-center justify-center"
            aria-label="Abrir chat"
          >
            <MessageCircle className="w-6 h-6" />
            
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-theme-primary" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-theme-secondary border border-theme rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Asistente DerechoGo</h4>
                    <div className="flex items-center gap-1 text-amber-100 text-xs">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      En línea
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Cerrar chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-theme-primary">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'bot' 
                      ? 'bg-accent/20' 
                      : 'bg-theme-hover'
                  }`}>
                    {message.type === 'bot' ? (
                      <Bot className="w-4 h-4 text-accent" />
                    ) : (
                      <User className="w-4 h-4 text-theme-secondary" />
                    )}
                  </div>
                  <div className={`max-w-[75%] ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block px-4 py-2 rounded-2xl text-sm ${
                      message.type === 'bot'
                        ? 'bg-theme-secondary text-theme-primary rounded-tl-none'
                        : 'bg-accent text-theme-secondary rounded-tr-none'
                    }`}>
                      {message.text}
                    </div>
                    <p className="text-xs text-theme-tertiary mt-1 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-accent" />
                  </div>
                  <div className="bg-theme-secondary px-4 py-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-theme-tertiary rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                        className="w-2 h-2 bg-theme-tertiary rounded-full"
                      />
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-theme-tertiary rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Replies */}
            {messages.length < 3 && (
              <div className="px-4 py-3 bg-theme-secondary border-t border-theme">
                <p className="text-xs text-theme-tertiary mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Respuestas rápidas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(reply)}
                      className="px-3 py-1.5 bg-theme-tertiary text-theme-secondary text-xs rounded-full hover:bg-accent/20 hover:text-accent transition-colors flex items-center gap-1"
                    >
                      {reply}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-4 bg-theme-secondary border-t border-theme"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2.5 bg-theme-primary border border-theme rounded-xl text-white placeholder-theme-tertiary focus:outline-none focus:border-accent transition-colors text-sm"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-2.5 bg-accent text-theme-secondary rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
