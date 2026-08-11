import React, { useState } from 'react';
import { Send, Users, MessageSquare, Gamepad2 } from 'lucide-react';
import { ChatMessage, Friend } from '../../types/gamestan';

const initialFriends: Friend[] = [
  { id: '1', name: 'آرش شطرنج‌باز', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', status: 'ingame', game: 'شطرنج', score: 1420 },
  { id: '2', name: 'سارا اتلو', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', status: 'online', score: 980 },
  { id: '3', name: 'رضا سودوکو', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', status: 'offline', score: 1150 }
];

const initialMessages: ChatMessage[] = [
  { id: '1', sender: 'آرش شطرنج‌باز', text: 'سلام! یک دست شطرنج می‌زنی؟', time: '14:20', isMe: false },
  { id: '2', sender: 'شما', text: 'سلام، حتما! اتاق رو بساز دعوت کن.', time: '14:22', isMe: true }
];

export const ChatFriendsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'friends'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'شما',
      text: input,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-2.5 select-none" dir="rtl">
      {/* Tab Switcher */}
      <div className="flex bg-slate-900 p-1 rounded-xl mb-2.5 border border-slate-800">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'chat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          چت همگانی (`chat`)
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'friends' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          دوستان (`friends`)
        </button>
      </div>

      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Chat list */}
          <div className="flex-1 overflow-y-auto space-y-2 p-1">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2.5 rounded-2xl text-xs ${
                    msg.isMe
                      ? 'bg-indigo-600 text-white rounded-tl-none shadow-md'
                      : 'bg-slate-800 text-slate-200 rounded-tr-none border border-slate-700'
                  }`}
                >
                  {!msg.isMe && <p className="font-bold text-[10px] text-indigo-300 mb-0.5">{msg.sender}</p>}
                  <p>{msg.text}</p>
                  <span className="text-[9px] opacity-60 text-left block mt-1">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex gap-1.5 mt-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="پیامی بنویسید..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSend}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Friends list */
        <div className="flex-1 overflow-y-auto space-y-2">
          {initialFriends.map(friend => (
            <div
              key={friend.id}
              className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                      friend.status === 'online'
                        ? 'bg-emerald-500'
                        : friend.status === 'ingame'
                        ? 'bg-amber-500'
                        : 'bg-slate-600'
                    }`}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">{friend.name}</h4>
                  <p className="text-[10px] text-slate-400">
                    {friend.status === 'ingame' ? `در حال بازی ${friend.game}` : friend.status === 'online' ? 'آنلاین' : 'آفلاین'}
                  </p>
                </div>
              </div>

              <button className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1 border border-indigo-500/30">
                <Gamepad2 className="w-3.5 h-3.5" />
                دعوت
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
