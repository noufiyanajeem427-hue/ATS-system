import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaEnvelope, FaPaperPlane, FaReply, 
  FaStar, FaTrash, FaCheckCircle, FaPlus, FaSpinner,
  FaUser, FaTimes, FaInbox, FaSend
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import axios from '../../../api/axiosConfig';

const MessageCenter = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({
    
    recipient: '',
    recipientName: '',
    subject: '',
    content: ''
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeTab === 'sent') params.append('type', 'sent');
      
      const response = await axios.get(`/messages?${params.toString()}`);
      const data = response.data.data || [];
      
      if (activeTab === 'sent') {
        setSentMessages(data);
      } else {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!composeData.recipient || !composeData.subject || !composeData.content) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSending(true);
      await axios.post('/messages', composeData);
      toast.success('Message sent successfully!');
      setShowCompose(false);
      setComposeData({ recipient: '', recipientName: '', subject: '', content: '' });
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`/messages/${id}`);
        toast.success('Message deleted');
        fetchMessages();
        if (selectedThread === id) setSelectedThread(null);
      } catch (error) {
        toast.error('Failed to delete message');
      }
    }
  };

  const handleToggleStar = async (id) => {
    try {
      await axios.patch(`/messages/${id}/star`);
      fetchMessages();
    } catch (error) {
      toast.error('Failed to update star status');
    }
  };

  const currentMessages = activeTab === 'inbox' ? messages : sentMessages;
  
  const filteredMessages = currentMessages.filter(msg => {
    const name = activeTab === 'inbox' ? msg.senderName : msg.recipientName;
    return name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           msg.subject?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const unreadCount = messages.filter(m => !m.read).length;
  const starredCount = messages.filter(m => m.starred).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-500">Communication center</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          New Message
        </button>
      </div>

      {/* Message Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-indigo-200 transition-all">
          <p className="text-2xl font-bold text-indigo-600">{messages.length + sentMessages.length}</p>
          <p className="text-sm text-gray-500">Total Messages</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
          <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
          <p className="text-sm text-gray-500">Unread</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-yellow-200 transition-all">
          <p className="text-2xl font-bold text-yellow-600">{starredCount}</p>
          <p className="text-sm text-gray-500">Starred</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-green-200 transition-all">
          <p className="text-2xl font-bold text-green-600">{sentMessages.length}</p>
          <p className="text-sm text-gray-500">Sent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'inbox'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaInbox className="w-4 h-4" />
                Inbox {unreadCount > 0 && `(${unreadCount})`}
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'sent'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaSend className="w-4 h-4" />
                Sent
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'inbox' ? "Search messages..." : "Search sent messages..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Messages */}
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            <AnimatePresence>
              {filteredMessages.map((msg, index) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedThread(msg._id === selectedThread ? null : msg._id)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-all ${
                    !msg.read && activeTab === 'inbox' ? 'bg-indigo-50' : ''
                  } ${selectedThread === msg._id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                      {activeTab === 'inbox' ? msg.senderName?.charAt(0) || 'U' : msg.recipientName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {activeTab === 'inbox' ? msg.senderName || 'Unknown' : msg.recipientName || 'Unknown'}
                          </p>
                          {msg.starred && <FaStar className="w-3 h-3 text-yellow-500" />}
                          {!msg.read && activeTab === 'inbox' && (
                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 truncate">{msg.subject || 'No subject'}</p>
                      <p className="text-sm text-gray-500 truncate">{msg.preview || msg.content?.substring(0, 60) + '...'}</p>
                      {activeTab === 'sent' && msg.status && (
                        <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <FaCheckCircle className="w-3 h-3" />
                          {msg.status}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaEnvelope className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No messages found</h3>
                <p className="text-sm text-gray-500 mt-1">Your {activeTab} is empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Preview / Compose */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {selectedThread ? (
            (() => {
              const msg = [...messages, ...sentMessages].find(m => m._id === selectedThread);
              if (!msg) return null;
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Message Details</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleToggleStar(msg._id)}
                        className={`p-2 transition-all rounded-lg ${msg.starred ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}`}
                      >
                        <FaStar className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMessage(msg._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-all rounded-lg"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-medium text-gray-900">
                        {activeTab === 'inbox' ? msg.senderName : msg.recipientName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Subject</p>
                      <p className="font-medium text-gray-900">{msg.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Message</p>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        setComposeData({
                          recipient: activeTab === 'inbox' ? msg.sender : '',
                          recipientName: activeTab === 'inbox' ? msg.senderName : '',
                          subject: `Re: ${msg.subject}`,
                          content: ''
                        });
                        setShowCompose(true);
                        setSelectedThread(null);
                      }}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                      <FaReply className="w-4 h-4" />
                      Reply
                    </button>
                  </div>
                </div>
              );
            })()
          ) : showCompose ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">New Message</h3>
                <button 
                  onClick={() => setShowCompose(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <FaTimes className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To *</label>
                  <input
                    type="text"
                    value={composeData.recipientName}
                    onChange={(e) => setComposeData({ 
                      ...composeData, 
                      recipientName: e.target.value,
                      recipient: e.target.value
                    })}
                    placeholder="Recipient name or email"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    value={composeData.subject}
                    onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                    placeholder="Message subject"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    value={composeData.content}
                    onChange={(e) => setComposeData({ ...composeData, content: e.target.value })}
                    rows="5"
                    placeholder="Type your message here..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sending ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaPaperPlane className="w-4 h-4" />}
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Select a message</h3>
              <p className="text-sm text-gray-500 mt-1">Choose a message to view details</p>
              <button
                onClick={() => setShowCompose(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 mx-auto"
              >
                <FaPlus className="w-4 h-4" />
                Compose New
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;
