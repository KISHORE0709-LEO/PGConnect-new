import { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Send } from 'lucide-react';
import { geminiAI } from '@/lib/geminiAI';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const SplineChatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm Chitti, your AI assistant powered by Google Gemini. I can help with PG recommendations, bookings, roommate matching, or answer any questions you have. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await geminiAI.generateResponse(currentInput);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: aiResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again or contact support for immediate assistance.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Spline Robot - Slightly Larger */}
      <div 
        className="fixed bottom-6 right-6 z-50 w-36 h-36 cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={() => setIsChatOpen(true)}
      >
        <Spline
          scene="https://prod.spline.design/rU2-Ks0SC0T5od9B/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Chat Interface */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-96">
          <Card className="w-full h-full flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Spline
                    scene="https://prod.spline.design/rU2-Ks0SC0T5od9B/scene.splinecode"
                    style={{ width: '100%', height: '100%', transform: 'scale(1.2)' }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Chitti</h3>
                  <p className="text-xs opacity-90">Powered by Gemini</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-blue-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm whitespace-pre-line ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-2 rounded-lg text-sm text-gray-600">
                    AI is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button onClick={handleSendMessage} size="sm" disabled={isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default SplineChatbot;