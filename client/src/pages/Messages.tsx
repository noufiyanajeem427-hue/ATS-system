import React, { useState, useRef, useEffect } from 'react';
import Topbar from '../components/Topbar';
import {
  Search, Send, Paperclip, Smile, MoreVertical,
  Phone, Video, Check, CheckCheck, Star,
  X, Sparkles, Plus, Building2, Image, Zap
} from 'lucide-react';
import { ButtonSpinner } from '../components/Loading';
import { Page } from '../App';

interface MessagesProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page, job?: any) => void;
}

type MsgType = 'sent' | 'received';

interface Message {
  id: number;
  text: string;
  time: string;
  type: MsgType;
  read?: boolean;
  attachment?: { name: string; size: string };
}

interface Conversation {
  id: number;
  name: string;
  title: string;
  company: string;
  avatar: string;
  avatarBg: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  starred: boolean;
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    title: 'Engineering Manager',
    company: 'Netflix',
    avatar: 'SC',
    avatarBg: 'linear-gradient(135deg,#e50914,#831010)',
    lastMsg: 'Looking forward to the technical round tomorrow!',
    time: '10:42 AM',
    unread: 2,
    online: true,
    starred: true,
    messages: [
      { id: 1, text: "Hi Alex! Thanks for reaching out about the Senior Product Designer role at Netflix.", time: '10:30 AM', type: 'received' },
      { id: 2, text: "Hi Sarah! Really excited about the opportunity. I've reviewed the job requirements and prepared portfolio examples.", time: '10:35 AM', type: 'sent', read: true },
      { id: 3, text: "Great! Our team was very impressed by your AI design systems background. We'd love to schedule a 45-min technical interview.", time: '10:40 AM', type: 'received' },
      { id: 4, text: "Looking forward to the technical round tomorrow!", time: '10:42 AM', type: 'received' },
    ]
  },
  {
    id: 2,
    name: 'Marcus Vance',
    title: 'Head of Talent',
    company: 'Stripe',
    avatar: 'MV',
    avatarBg: 'linear-gradient(135deg,#635bff,#0a2540)',
    lastMsg: 'Your resume score was in the top 2% of candidates.',
    time: 'Yesterday',
    unread: 0,
    online: false,
    starred: false,
    messages: [
      { id: 1, text: "Hello Alex, I'm Marcus from Stripe. We came across your profile via NexHire AI.", time: 'Yesterday 2:15 PM', type: 'received' },
      { id: 2, text: "Your resume score was in the top 2% of candidates.", time: 'Yesterday 2:16 PM', type: 'received' },
      { id: 3, text: "Thank you Marcus! I'm definitely interested in learning more about the Design Lead role.", time: 'Yesterday 3:00 PM', type: 'sent', read: true },
    ]
  },
  {
    id: 3,
    name: 'Elena Rostova',
    title: 'Lead Recruiter',
    company: 'Verdant Labs',
    avatar: 'ER',
    avatarBg: 'linear-gradient(135deg,#10b981,#047857)',
    lastMsg: 'Offer letter details sent to your email!',
    time: 'Oct 18',
    unread: 0,
    online: true,
    starred: true,
    messages: [
      { id: 1, text: "Congratulations Alex! The team has decided to extend an offer.", time: 'Oct 18', type: 'received' },
      { id: 2, text: "Offer letter details sent to your email!", time: 'Oct 18', type: 'received' },
      { id: 3, text: "Thank you so much Elena! I will review it today.", time: 'Oct 18', type: 'sent', read: true },
    ]
  },
];

const aiSuggestions = [
  "Thank you for the update! What time works best for the call?",
  "I've attached my updated portfolio showcasing recent design systems work.",
  "Sounds great! Looking forward to meeting the engineering team.",
];

const Messages: React.FC<MessagesProps> = ({ onMenuClick, onNavigate }) => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = conversations.find(c => c.id === activeId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [active.messages]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const selectConversation = (id: number) => {
    setActiveId(id);
    setConversations(cs => cs.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = () => {
    if (!inputText.trim()) return;

    setSending(true);
    const text = inputText;

    setTimeout(() => {
      const newMsg: Message = {
        id: Date.now(),
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'sent',
        read: false,
      };

      setConversations(cs => cs.map(c =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], lastMsg: text, time: 'Just now' }
          : c
      ));

      setInputText('');
      setShowAI(false);
      setSending(false);
    }, 300);
  };

  const applySuggestion = (s: string) => {
    setInputText(s);
    setShowAI(false);
    inputRef.current?.focus();
  };

  const toggleStar = (id: number) => {
    setConversations(cs => cs.map(c => c.id === id ? { ...c, starred: !c.starred } : c));
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="flex flex-col h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] dark:bg-[#0b0f19] text-[#1a1a2e] dark:text-[#f8fafc] overflow-hidden transition-colors duration-200">
      <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>

        {/* ── LEFT: Conversation List ── */}
        <div className="w-full sm:w-[320px] xl:w-[340px] flex-shrink-0 flex flex-col bg-white dark:bg-[#111827] border-r border-[#e4e8f0] dark:border-[#1f2d42] overflow-hidden">

          {/* Header */}
          <div className="px-4 pt-5 pb-3 border-b border-[#f0f2f8] dark:border-[#1f2d42]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[18px] font-black text-[#1a1a2e] dark:text-[#f8fafc]">Messages</h2>
                {totalUnread > 0 && (
                  <p className="text-[11px] text-[#8890a4] dark:text-[#94a3b8] mt-0.5">{totalUnread} unread message{totalUnread > 1 ? 's' : ''}</p>
                )}
              </div>
              <button
                className="w-8 h-8 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all hover:-translate-y-0.5 text-white"
                style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 3px 10px rgba(108,99,255,0.35)' }}
                title="New Message"
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0b8cc] dark:text-[#64748b]" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#f4f6fb] dark:bg-[#161e2e] border border-[#e4e8f0] dark:border-[#1f2d42] text-[13px] text-[#1a1a2e] dark:text-[#f8fafc] outline-none focus:border-[#6c63ff] placeholder:text-[#b0b8cc] dark:placeholder:text-[#64748b] transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0b8cc] bg-transparent border-none cursor-pointer hover:text-[#4a5068]">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {/* Starred */}
            {filtered.some(c => c.starred) && (
              <div className="px-4 pt-3 pb-1">
                <p className="text-[10px] font-bold text-[#b0b8cc] dark:text-[#64748b] uppercase tracking-widest flex items-center gap-1.5">
                  <Star size={9} className="text-[#f59e0b]" fill="#f59e0b" /> Starred
                </p>
              </div>
            )}
            {filtered.filter(c => c.starred).map(c => (
              <ConvoItem key={c.id} c={c} active={activeId === c.id} onSelect={selectConversation} onStar={toggleStar} />
            ))}

            {/* All Messages */}
            <div className="px-4 pt-3 pb-1">
              <p className="text-[10px] font-bold text-[#b0b8cc] dark:text-[#64748b] uppercase tracking-widest">All Messages</p>
            </div>
            {filtered.filter(c => !c.starred).map(c => (
              <ConvoItem key={c.id} c={c} active={activeId === c.id} onSelect={selectConversation} onStar={toggleStar} />
            ))}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <Search size={28} className="text-[#d1d5db] dark:text-[#374151] mb-3" />
                <p className="text-[13px] font-semibold text-[#8890a4] dark:text-[#94a3b8]">No results for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Chat Panel ── */}
        <div className="flex-1 flex flex-col bg-[#f8f9fc] dark:bg-[#0b0f19] overflow-hidden min-w-0">

          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-white dark:bg-[#111827] border-b border-[#e4e8f0] dark:border-[#1f2d42] flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black text-white" style={{ background: active.avatarBg }}>{active.avatar}</div>
                {active.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00c853] border-2 border-white dark:border-[#111827]" />}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc] truncate">{active.name}</p>
                <div className="flex items-center gap-1.5">
                  <Building2 size={10} className="text-[#b0b8cc] flex-shrink-0" />
                  <p className="text-[11px] text-[#8890a4] dark:text-[#94a3b8] truncate">{active.title} · {active.company}</p>
                  {active.online && <span className="text-[10px] text-[#00c853] font-bold flex-shrink-0">· Online</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="w-8 h-8 rounded-xl bg-[#f4f6fb] dark:bg-[#161e2e] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 hover:text-[#6c63ff] text-[#8890a4] dark:text-[#94a3b8] transition-colors" title="Voice Call">
                <Phone size={14} />
              </button>
              <button className="w-8 h-8 rounded-xl bg-[#f4f6fb] dark:bg-[#161e2e] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 hover:text-[#6c63ff] text-[#8890a4] dark:text-[#94a3b8] transition-colors" title="Video Call">
                <Video size={14} />
              </button>
              <button className="w-8 h-8 rounded-xl bg-[#f4f6fb] dark:bg-[#161e2e] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 hover:text-[#6c63ff] text-[#8890a4] dark:text-[#94a3b8] transition-colors" title="More Options">
                <MoreVertical size={14} />
              </button>
            </div>
          </div>

          {/* Context banner */}
          <div className="flex items-center gap-3 px-5 py-2.5 bg-[#6c63ff]/5 dark:bg-[#6c63ff]/10 border-b border-[#6c63ff]/10 flex-shrink-0">
            <div className="w-5 h-5 rounded-md bg-[#6c63ff]/15 flex items-center justify-center flex-shrink-0">
              <Zap size={11} className="text-[#6c63ff] dark:text-[#a78bfa]" />
            </div>
            <p className="text-[11px] text-[#4a5068] dark:text-[#cbd5e1] flex-1 min-w-0">
              <span className="font-bold text-[#6c63ff] dark:text-[#a78bfa]">{active.company}</span> · Contacted you for <span className="font-semibold">{active.title.includes('Manager') || active.title.includes('Director') || active.title.includes('Head') ? 'a leadership role' : 'a senior role'}</span>
            </p>
            <button className="text-[10px] font-bold text-[#6c63ff] dark:text-[#a78bfa] bg-transparent border-none cursor-pointer hover:underline flex-shrink-0">
              View Job →
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
            {active.messages.map((msg, idx) => {
              const showAvatar = msg.type === 'received' && (idx === 0 || active.messages[idx - 1].type === 'sent');
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.type === 'sent' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar placeholder for received */}
                  {msg.type === 'received' ? (
                    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black text-white ${showAvatar ? 'visible' : 'invisible'}`} style={{ background: active.avatarBg }}>
                      {active.avatar}
                    </div>
                  ) : null}

                  <div className={`flex flex-col gap-1 max-w-[72%] ${msg.type === 'sent' ? 'items-end' : 'items-start'}`}>
                    {/* Attachment */}
                    {msg.attachment && (
                      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-[12px] cursor-pointer hover:shadow-sm transition-shadow ${msg.type === 'sent' ? 'bg-[#6c63ff] text-white border-[#6c63ff]' : 'bg-white dark:bg-[#161e2e] text-[#4a5068] dark:text-[#cbd5e1] border-[#e4e8f0] dark:border-[#1f2d42]'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${msg.type === 'sent' ? 'bg-white/20' : 'bg-[#6c63ff]/10'}`}>
                          <Paperclip size={14} className={msg.type === 'sent' ? 'text-white' : 'text-[#6c63ff]'} />
                        </div>
                        <div>
                          <p className="font-semibold">{msg.attachment.name}</p>
                          <p className={`text-[10px] ${msg.type === 'sent' ? 'text-white/70' : 'text-[#b0b8cc]'}`}>{msg.attachment.size}</p>
                        </div>
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                        msg.type === 'sent'
                          ? 'text-white rounded-br-md'
                          : 'bg-white dark:bg-[#161e2e] text-[#1a1a2e] dark:text-[#f8fafc] rounded-bl-md border border-[#e4e8f0] dark:border-[#1f2d42]'
                      }`}
                      style={msg.type === 'sent' ? { background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' } : {}}
                    >
                      {msg.text}
                    </div>

                    {/* Time + read */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-[#b0b8cc] dark:text-[#64748b]">{msg.time}</span>
                      {msg.type === 'sent' && (
                        msg.read
                          ? <CheckCheck size={12} className="text-[#6c63ff] dark:text-[#a78bfa]" />
                          : <Check size={12} className="text-[#b0b8cc] dark:text-[#64748b]" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Suggestions */}
          {showAI && (
            <div className="px-5 pb-2 flex-shrink-0">
              <div className="bg-white dark:bg-[#111827] rounded-2xl border border-[#6c63ff]/20 shadow-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#f0f2f8] dark:border-[#1f2d42] bg-[#6c63ff]/4">
                  <Sparkles size={12} className="text-[#6c63ff]" />
                  <span className="text-[11px] font-bold text-[#6c63ff]">AI Smart Replies</span>
                  <button onClick={() => setShowAI(false)} className="ml-auto text-[#b0b8cc] bg-transparent border-none cursor-pointer hover:text-[#4a5068]"><X size={12} /></button>
                </div>
                <div className="flex flex-col">
                  {aiSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => applySuggestion(s)}
                      className="text-left px-4 py-3 text-[12px] text-[#4a5068] dark:text-[#cbd5e1] hover:bg-[#6c63ff]/5 hover:text-[#6c63ff] border-none bg-transparent cursor-pointer transition-colors border-b border-[#f0f2f8] dark:border-[#1f2d42] last:border-0"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input bar */}
          <div className="px-5 py-4 bg-white dark:bg-[#111827] border-t border-[#e4e8f0] dark:border-[#1f2d42] flex-shrink-0">
            <div className="flex items-end gap-3">
              {/* Attachment */}
              <button className="w-9 h-9 rounded-xl bg-[#f4f6fb] dark:bg-[#161e2e] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 hover:text-[#6c63ff] text-[#b0b8cc] transition-colors flex-shrink-0">
                <Paperclip size={16} />
              </button>

              {/* Input container */}
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={`Message ${active.name}...`}
                  className="w-full px-4 py-3 pr-24 rounded-2xl border border-[#e4e8f0] dark:border-[#1f2d42] text-[13px] text-[#1a1a2e] dark:text-[#f8fafc] outline-none focus:border-[#6c63ff] bg-[#f8f9fc] dark:bg-[#161e2e] placeholder:text-[#b0b8cc] dark:placeholder:text-[#64748b] transition-colors"
                />
                {/* Right side actions inside input */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <button
                    onClick={() => setShowAI(!showAI)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border-none cursor-pointer transition-all ${showAI ? 'bg-[#6c63ff] text-white' : 'text-[#b0b8cc] hover:text-[#6c63ff] bg-transparent'}`}
                    title="AI Suggestions"
                  >
                    <Sparkles size={13} />
                  </button>
                </div>
              </div>

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={sending || !inputText.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white border-none cursor-pointer transition-all hover:opacity-90 disabled:opacity-40 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.35)' }}
              >
                {sending ? <ButtonSpinner size={16} color="#ffffff" /> : <Send size={16} />}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

const ConvoItem: React.FC<{
  c: Conversation;
  active: boolean;
  onSelect: (id: number) => void;
  onStar: (id: number) => void;
}> = ({ c, active, onSelect, onStar }) => (
  <div
    onClick={() => onSelect(c.id)}
    className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all relative group ${active ? 'bg-[#6c63ff]/8 border-r-2 border-[#6c63ff]' : 'hover:bg-[#f8f9fc] dark:hover:bg-[#161e2e]'}`}
  >
    {/* Avatar */}
    <div className="relative flex-shrink-0">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black text-white" style={{ background: c.avatarBg }}>{c.avatar}</div>
      {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00c853] border-2 border-white dark:border-[#111827]" />}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-1 mb-0.5">
        <span className={`text-[13px] truncate ${active ? 'font-extrabold text-[#6c63ff] dark:text-[#a78bfa]' : 'font-bold text-[#1a1a2e] dark:text-[#f8fafc]'}`}>{c.name}</span>
        <span className="text-[10px] text-[#b0b8cc] dark:text-[#64748b] flex-shrink-0">{c.time}</span>
      </div>
      <div className="flex items-center gap-1 mb-1">
        <Building2 size={9} className="text-[#c4c9d4] flex-shrink-0" />
        <span className="text-[10px] text-[#b0b8cc] dark:text-[#64748b] truncate">{c.company}</span>
      </div>
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] text-[#8890a4] dark:text-[#94a3b8] truncate flex-1">{c.lastMsg}</span>
        {c.unread > 0 && (
          <span className="w-5 h-5 rounded-full text-white text-[9px] font-black flex items-center justify-center flex-shrink-0" style={{ background: '#6c63ff' }}>{c.unread}</span>
        )}
      </div>
    </div>

    {/* Star */}
    <button
      onClick={e => { e.stopPropagation(); onStar(c.id); }}
      className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-transparent border-none cursor-pointer transition-opacity p-0.5 ${c.starred ? '!opacity-100' : ''}`}
    >
      <Star size={12} className={c.starred ? 'text-[#f59e0b]' : 'text-[#c4c9d4]'} fill={c.starred ? '#f59e0b' : 'none'} />
    </button>
  </div>
);

export default Messages;
