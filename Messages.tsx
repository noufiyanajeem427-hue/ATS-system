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
    time: '2m ago',
    unread: 2,
    online: true,
    starred: true,
    messages: [
      { id: 1, text: "Hi Alex! I'm Sarah, Engineering Manager at Netflix. I came across your profile and I'm very impressed with your design work at Meta.", time: '10:02 AM', type: 'received', read: true },
      { id: 2, text: "Thank you, Sarah! I've been a huge fan of Netflix's design culture. I'd love to learn more about the opportunity.", time: '10:05 AM', type: 'sent', read: true },
      { id: 3, text: "Wonderful! We have an opening for a Senior Product Designer on the Content Discovery team. The role involves redesigning how 230M+ users find their next favorite show. Does that sound interesting?", time: '10:08 AM', type: 'received', read: true },
      { id: 4, text: "Absolutely! That's exactly the kind of impact-driven work I'm passionate about. I'd love to discuss further.", time: '10:12 AM', type: 'sent', read: true },
      { id: 5, text: "Great! I've reviewed your portfolio and it's outstanding. Let's schedule a technical round for Oct 24 at 10 AM PST. Does that work?", time: '10:15 AM', type: 'received', read: true },
      { id: 6, text: "That works perfectly! I'll block it off on my calendar. Should I prepare anything specific?", time: '10:18 AM', type: 'sent', read: true },
      { id: 7, text: "Just bring your best work and be ready to walk through your design process. We love seeing how you think!", time: '10:20 AM', type: 'received', read: true },
      { id: 8, text: "Looking forward to the technical round tomorrow!", time: '10:45 AM', type: 'received', read: false },
      { id: 9, text: "Me too! I'll be fully prepared. See you then! 🚀", time: '10:46 AM', type: 'sent', read: false },
    ],
  },
  {
    id: 2,
    name: 'James Park',
    title: 'Creative Director',
    company: 'Nova Capital',
    avatar: 'JP',
    avatarBg: 'linear-gradient(135deg,#f093fb,#f5576c)',
    lastMsg: 'Can you share your portfolio link?',
    time: '1h ago',
    unread: 1,
    online: false,
    starred: false,
    messages: [
      { id: 1, text: "Hey Alex! We're looking for a Lead UI Engineer and your profile came up. Interested?", time: '9:00 AM', type: 'received', read: true },
      { id: 2, text: "Hi James! Yes, definitely interested. Can you tell me more about the role?", time: '9:05 AM', type: 'sent', read: true },
      { id: 3, text: "It's a senior design leadership role — you'd own the entire design language for our fintech platform. $190k-$240k range.", time: '9:10 AM', type: 'received', read: true },
      { id: 4, text: "That sounds excellent. I have extensive experience with design systems at Stripe and Meta.", time: '9:15 AM', type: 'sent', read: true },
      { id: 5, text: "Can you share your portfolio link?", time: '9:20 AM', type: 'received', read: false },
    ],
  },
  {
    id: 3,
    name: 'Priya Sharma',
    title: 'Head of Product',
    company: 'Verdant Labs',
    avatar: 'PS',
    avatarBg: 'linear-gradient(135deg,#4facfe,#00f2fe)',
    lastMsg: 'The offer letter is ready for you to review.',
    time: '3h ago',
    unread: 0,
    online: true,
    starred: true,
    messages: [
      { id: 1, text: "Alex, great news! We'd love to extend you a formal offer for the UX Research Lead position.", time: '8:00 AM', type: 'received', read: true },
      { id: 2, text: "Priya, that's incredible news! I'm thrilled!", time: '8:02 AM', type: 'sent', read: true },
      { id: 3, text: "The offer includes a €145k base, 20% bonus, equity, and full relocation support to Berlin.", time: '8:05 AM', type: 'received', read: true },
      { id: 4, text: "That is very competitive and aligns with my expectations. When should I expect the formal paperwork?", time: '8:08 AM', type: 'sent', read: true },
      { id: 5, text: "The offer letter is ready for you to review.", time: '8:10 AM', type: 'received', read: true, attachment: { name: 'OfferLetter_VerdantLabs.pdf', size: '1.2 MB' } },
    ],
  },
  {
    id: 4,
    name: 'Mike Torres',
    title: 'HR Manager',
    company: 'Airbnb',
    avatar: 'MT',
    avatarBg: 'linear-gradient(135deg,#ff5a5f,#c2185b)',
    lastMsg: 'Thanks for your time today, Alex!',
    time: 'Yesterday',
    unread: 0,
    online: false,
    starred: false,
    messages: [
      { id: 1, text: "Hi Alex! Thanks for taking the screening call today. We're really impressed.", time: 'Yesterday 3:30 PM', type: 'received', read: true },
      { id: 2, text: "It was great chatting, Mike! I'm excited about the potential at Airbnb.", time: 'Yesterday 3:32 PM', type: 'sent', read: true },
      { id: 3, text: "We'll be passing your profile to the team for the next round. Expect an email from us by Friday.", time: 'Yesterday 3:35 PM', type: 'received', read: true },
      { id: 4, text: "Thanks for your time today, Alex!", time: 'Yesterday 3:36 PM', type: 'received', read: true },
    ],
  },
  {
    id: 5,
    name: 'Anna Kim',
    title: 'Principal Designer',
    company: 'Stripe',
    avatar: 'AK',
    avatarBg: 'linear-gradient(135deg,#6772e5,#4b50d4)',
    lastMsg: 'Your technical assessment was exceptional!',
    time: 'Oct 12',
    unread: 0,
    online: false,
    starred: false,
    messages: [
      { id: 1, text: "Alex, our panel just finished reviewing your technical assessment. It was truly exceptional!", time: 'Oct 12 2:00 PM', type: 'received', read: true },
      { id: 2, text: "Thank you so much, Anna! I put a lot of thought into the design system case study.", time: 'Oct 12 2:05 PM', type: 'sent', read: true },
      { id: 3, text: "It showed! You'll be hearing from our team about next steps very soon. Keep an eye on your inbox!", time: 'Oct 12 2:08 PM', type: 'received', read: true },
      { id: 4, text: "Your technical assessment was exceptional!", time: 'Oct 12 2:10 PM', type: 'received', read: true },
    ],
  },
];

const aiSuggestions = [
  "Thank you! I'll review the offer letter and get back to you by tomorrow.",
  "That works perfectly for me. Looking forward to it!",
  "Absolutely! Here's my portfolio: alexrivera.design",
];

const Messages: React.FC<MessagesProps> = ({ onMenuClick, onNavigate }) => {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(1);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = conversations.find(c => c.id === activeId)!;

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, conversations]);

  // Mark messages read when switching convo
  const selectConversation = (id: number) => {
    setActiveId(id);
    setConversations(cs => cs.map(c =>
      c.id === id
        ? { ...c, unread: 0, messages: c.messages.map(m => ({ ...m, read: true })) }
        : c
    ));
    setShowAI(false);
  };

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text || sending) return;

    setSending(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg: Message = {
        id: Date.now(),
        text,
        time: timeStr,
        type: 'sent',
        read: true,
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
    <div className="flex flex-col h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] overflow-hidden">
      <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>

        {/* ── LEFT: Conversation List ── */}
        <div className="w-full sm:w-[320px] xl:w-[340px] flex-shrink-0 flex flex-col bg-white border-r border-[#e4e8f0] overflow-hidden">

          {/* Header */}
          <div className="px-4 pt-5 pb-3 border-b border-[#f0f2f8]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[18px] font-black text-[#1a1a2e]">Messages</h2>
                {totalUnread > 0 && (
                  <p className="text-[11px] text-[#8890a4] mt-0.5">{totalUnread} unread message{totalUnread > 1 ? 's' : ''}</p>
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
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0b8cc]" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#f4f6fb] border border-[#e4e8f0] text-[13px] text-[#1a1a2e] outline-none focus:border-[#6c63ff] placeholder:text-[#b0b8cc] transition-colors"
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
                <p className="text-[10px] font-bold text-[#b0b8cc] uppercase tracking-widest flex items-center gap-1.5">
                  <Star size={9} className="text-[#f59e0b]" fill="#f59e0b" /> Starred
                </p>
              </div>
            )}
            {filtered.filter(c => c.starred).map(c => (
              <ConvoItem key={c.id} c={c} active={activeId === c.id} onSelect={selectConversation} onStar={toggleStar} />
            ))}

            {/* All Messages */}
            <div className="px-4 pt-3 pb-1">
              <p className="text-[10px] font-bold text-[#b0b8cc] uppercase tracking-widest">All Messages</p>
            </div>
            {filtered.filter(c => !c.starred).map(c => (
              <ConvoItem key={c.id} c={c} active={activeId === c.id} onSelect={selectConversation} onStar={toggleStar} />
            ))}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <Search size={28} className="text-[#d1d5db] mb-3" />
                <p className="text-[13px] font-semibold text-[#8890a4]">No results for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Chat Panel ── */}
        <div className="flex-1 flex flex-col bg-[#f8f9fc] overflow-hidden min-w-0">

          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-[#e4e8f0] flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black text-white" style={{ background: active.avatarBg }}>{active.avatar}</div>
                {active.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00c853] border-2 border-white" />}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-extrabold text-[#1a1a2e] truncate">{active.name}</p>
                <div className="flex items-center gap-1.5">
                  <Building2 size={10} className="text-[#b0b8cc] flex-shrink-0" />
                  <p className="text-[11px] text-[#8890a4] truncate">{active.title} · {active.company}</p>
                  {active.online && <span className="text-[10px] text-[#00c853] font-bold flex-shrink-0">· Online</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="w-8 h-8 rounded-xl bg-[#f4f6fb] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 hover:text-[#6c63ff] text-[#8890a4] transition-colors" title="Voice Call">
                <Phone size={14} />
              </button>
              <button className="w-8 h-8 rounded-xl bg-[#f4f6fb] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 hover:text-[#6c63ff] text-[#8890a4] transition-colors" title="Video Call">
                <Video size={14} />
              </button>
              <button className="w-8 h-8 rounded-xl bg-[#f4f6fb] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 hover:text-[#6c63ff] text-[#8890a4] transition-colors" title="More Options">
                <MoreVertical size={14} />
              </button>
            </div>
          </div>

          {/* Context banner */}
          <div className="flex items-center gap-3 px-5 py-2.5 bg-[#6c63ff]/5 border-b border-[#6c63ff]/10 flex-shrink-0">
            <div className="w-5 h-5 rounded-md bg-[#6c63ff]/15 flex items-center justify-center flex-shrink-0">
              <Zap size={11} className="text-[#6c63ff]" />
            </div>
            <p className="text-[11px] text-[#4a5068] flex-1 min-w-0">
              <span className="font-bold text-[#6c63ff]">{active.company}</span> · Contacted you for <span className="font-semibold">{active.title.includes('Manager') || active.title.includes('Director') || active.title.includes('Head') ? 'a leadership role' : 'a senior role'}</span>
            </p>
            <button className="text-[10px] font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline flex-shrink-0">
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
                      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-[12px] cursor-pointer hover:shadow-sm transition-shadow ${msg.type === 'sent' ? 'bg-[#6c63ff] text-white border-[#6c63ff]' : 'bg-white text-[#4a5068] border-[#e4e8f0]'}`}>
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
                          : 'bg-white text-[#1a1a2e] rounded-bl-md border border-[#e4e8f0]'
                      }`}
                      style={msg.type === 'sent' ? { background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' } : {}}
                    >
                      {msg.text}
                    </div>

                    {/* Time + read */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-[#b0b8cc]">{msg.time}</span>
                      {msg.type === 'sent' && (
                        msg.read
                          ? <CheckCheck size={12} className="text-[#6c63ff]" />
                          : <Check size={12} className="text-[#b0b8cc]" />
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
              <div className="bg-white rounded-2xl border border-[#6c63ff]/20 shadow-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#f0f2f8] bg-[#6c63ff]/4">
                  <Sparkles size={12} className="text-[#6c63ff]" />
                  <span className="text-[11px] font-bold text-[#6c63ff]">AI Smart Replies</span>
                  <button onClick={() => setShowAI(false)} className="ml-auto text-[#b0b8cc] bg-transparent border-none cursor-pointer hover:text-[#4a5068]"><X size={12} /></button>
                </div>
                <div className="flex flex-col">
                  {aiSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => applySuggestion(s)}
                      className="text-left px-4 py-3 text-[12px] text-[#4a5068] hover:bg-[#6c63ff]/5 hover:text-[#6c63ff] border-none bg-transparent cursor-pointer transition-colors border-b border-[#f0f2f8] last:border-0"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input bar */}
          <div className="px-5 py-4 bg-white border-t border-[#e4e8f0] flex-shrink-0">
            <div className="flex items-end gap-3">
              {/* Attachment */}
              <button className="w-9 h-9 rounded-xl bg-[#f4f6fb] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 hover:text-[#6c63ff] text-[#b0b8cc] transition-colors flex-shrink-0">
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
                  className="w-full px-4 py-3 pr-24 rounded-2xl border border-[#e4e8f0] text-[13px] text-[#1a1a2e] outline-none focus:border-[#6c63ff] bg-[#f8f9fc] placeholder:text-[#b0b8cc] transition-colors"
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
                  <button className="w-6 h-6 rounded-lg flex items-center justify-center border-none cursor-pointer text-[#b0b8cc] hover:text-[#6c63ff] bg-transparent transition-colors" title="Emoji">
                    <Smile size={13} />
                  </button>
                  <button className="w-6 h-6 rounded-lg flex items-center justify-center border-none cursor-pointer text-[#b0b8cc] hover:text-[#6c63ff] bg-transparent transition-colors" title="Image">
                    <Image size={13} />
                  </button>
                </div>
              </div>

              {/* Send */}
              <button
                onClick={sendMessage}
                disabled={sending}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all flex-shrink-0 ${inputText.trim() ? 'text-white hover:-translate-y-0.5 shadow-md hover:shadow-lg' : 'text-[#b0b8cc] bg-[#f4f6fb]'}`}
                style={inputText.trim() ? { background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 12px rgba(108,99,255,0.35)' } : {}}
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

// ── Sub-component: Conversation List Item ──────────────────────────────────
const ConvoItem: React.FC<{
  c: Conversation;
  active: boolean;
  onSelect: (id: number) => void;
  onStar: (id: number) => void;
}> = ({ c, active, onSelect, onStar }) => (
  <div
    onClick={() => onSelect(c.id)}
    className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all relative group ${active ? 'bg-[#6c63ff]/8 border-r-2 border-[#6c63ff]' : 'hover:bg-[#f8f9fc]'}`}
  >
    {/* Avatar */}
    <div className="relative flex-shrink-0">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black text-white" style={{ background: c.avatarBg }}>{c.avatar}</div>
      {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00c853] border-2 border-white" />}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-1 mb-0.5">
        <span className={`text-[13px] truncate ${active ? 'font-extrabold text-[#6c63ff]' : 'font-bold text-[#1a1a2e]'}`}>{c.name}</span>
        <span className="text-[10px] text-[#b0b8cc] flex-shrink-0">{c.time}</span>
      </div>
      <div className="flex items-center gap-1 mb-1">
        <Building2 size={9} className="text-[#c4c9d4] flex-shrink-0" />
        <span className="text-[10px] text-[#b0b8cc] truncate">{c.company}</span>
      </div>
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] text-[#8890a4] truncate flex-1">{c.lastMsg}</span>
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
