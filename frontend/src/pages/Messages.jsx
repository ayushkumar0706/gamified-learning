import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Send, ArrowLeft, Loader2, MessageSquare, Search } from 'lucide-react';

export default function Messages() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [conversations, setConversations] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null); // The other user in the active chat
  const [messages, setMessages] = useState([]);
  
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef(null);
  
  // Parse URL to auto-open a chat if requested
  const initialUserId = searchParams.get('user');

  // Polling interval ref
  const pollingRef = useRef(null);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const data = await api.get('/messages');
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  // Fetch messages for active chat
  const fetchMessages = async (userId, isInitialLoad = false) => {
    if (isInitialLoad) setLoadingChat(true);
    try {
      const data = await api.get(`/messages/${userId}`);
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      if (isInitialLoad) setLoadingChat(false);
    }
  };

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      setLoadingConv(true);
      await fetchConversations();
      setLoadingConv(false);

      if (initialUserId) {
        // If there's an initial user, try to find them in existing conversations
        // Wait, we need their user info to display the header.
        // The endpoint GET /users/public/:id can be used if they aren't in the inbox yet.
        openChat(initialUserId);
      }
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When activeChatUser changes, set up polling and fetch messages
  useEffect(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    
    if (activeChatUser) {
      fetchMessages(activeChatUser._id, true);
      // Poll every 3 seconds
      pollingRef.current = setInterval(() => {
        fetchMessages(activeChatUser._id, false);
      }, 3000);
    }
    
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper to open chat (needs full user object if not in conversations list)
  const openChat = async (targetUserId) => {
    // 1. Look in existing conversations
    const existingConv = conversations.find(c => 
      c.participants.some(p => p._id === targetUserId)
    );
    
    if (existingConv) {
      const otherUser = existingConv.participants.find(p => p._id !== user?._id);
      setActiveChatUser(otherUser);
    } else {
      // 2. Fetch public profile to get their name
      try {
        const publicUser = await api.get(`/users/public/${targetUserId}`);
        setActiveChatUser(publicUser);
      } catch (err) {
        console.error('Failed to load target user:', err);
      }
    }
    
    // Update URL without reloading
    setSearchParams({ user: targetUserId }, { replace: true });
    
    // On mobile, this will switch views
  };

  const handleBackToInbox = () => {
    setActiveChatUser(null);
    setSearchParams({});
    fetchConversations(); // Refresh inbox to get read status updates
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser) return;
    
    setSending(true);
    try {
      const res = await api.post(`/messages/${activeChatUser._id}`, { content: newMessage });
      setMessages([...messages, res]);
      setNewMessage('');
      fetchConversations(); // update inbox preview
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  // Helper to get the other participant
  const getOtherParticipant = (conv) => {
    return conv.participants.find(p => p._id !== user?._id) || conv.participants[0];
  };

  const filteredConversations = conversations.filter(c => {
    const other = getOtherParticipant(c);
    const fullName = `${other.firstName} ${other.lastName || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="page-container h-[calc(100vh-80px)] max-h-[800px] py-4">
      <div className="flex h-full bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
        
        {/* LEFT PANE: Inbox */}
        <div className={`w-full md:w-80 lg:w-96 flex-col border-r border-[var(--color-border)] bg-[var(--color-card)] ${activeChatUser ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-[var(--color-border)]">
            <h1 className="text-xl font-black text-[var(--color-text)] mb-4">Messages</h1>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="input pl-9 text-sm py-2 bg-[var(--color-bg)] border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {loadingConv ? (
              <div className="flex justify-center p-8 text-[var(--color-text-subtle)]"><Loader2 className="animate-spin" /></div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-[var(--color-text-muted)] flex flex-col items-center">
                <MessageSquare size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No conversations found.</p>
                <p className="text-xs mt-1">Start a chat from someone's profile!</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {filteredConversations.map((conv) => {
                  const otherUser = getOtherParticipant(conv);
                  const isUnread = conv.lastMessage?.receiver === user?._id && !conv.lastMessage?.isRead;
                  const isActive = activeChatUser?._id === otherUser._id;
                  
                  return (
                    <button
                      key={conv._id}
                      onClick={() => openChat(otherUser._id)}
                      className={`w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-[var(--color-bg)] ${isActive ? 'bg-[var(--color-primary-light)] border-l-4 border-l-[var(--color-primary)]' : 'border-l-4 border-l-transparent'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center font-bold shrink-0 shadow-sm relative">
                        {otherUser.firstName?.[0]?.toUpperCase()}
                        {isUnread && (
                          <span className="absolute top-0 right-0 w-3 h-3 bg-[var(--color-danger)] border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <p className={`text-sm truncate ${isUnread ? 'font-bold text-[var(--color-text)]' : 'font-semibold text-[var(--color-text)]'}`}>
                            {otherUser.firstName} {otherUser.lastName}
                          </p>
                          {conv.lastMessage && (
                            <span className="text-[10px] text-[var(--color-text-subtle)] whitespace-nowrap ml-2">
                              {new Date(conv.lastMessage.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                        {conv.lastMessage && (
                          <p className={`text-xs truncate ${isUnread ? 'text-[var(--color-text)] font-semibold' : 'text-[var(--color-text-muted)]'}`}>
                            {conv.lastMessage.sender === user?._id ? 'You: ' : ''}{conv.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* RIGHT PANE: Chat View */}
        <div className={`flex-1 flex-col bg-[var(--color-bg)] ${!activeChatUser ? 'hidden md:flex' : 'flex w-full absolute inset-0 md:relative z-10 md:z-0'}`}>
          {activeChatUser ? (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-card)] flex items-center gap-3">
                <button onClick={handleBackToInbox} className="md:hidden p-2 -ml-2 text-[var(--color-text-subtle)] hover:text-[var(--color-text)]">
                  <ArrowLeft size={20} />
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                  {activeChatUser.firstName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--color-text)]">{activeChatUser.firstName} {activeChatUser.lastName}</h2>
                </div>
              </div>
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingChat ? (
                  <div className="flex justify-center p-4"><Loader2 className="animate-spin text-[var(--color-text-subtle)]" /></div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                    <p className="text-sm">No messages yet.</p>
                    <p className="text-xs">Say hello to {activeChatUser.firstName}!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.sender === user?._id;
                    const showTime = idx === 0 || (new Date(msg.createdAt) - new Date(messages[idx-1].createdAt) > 5 * 60 * 1000);
                    
                    return (
                      <div key={msg._id} className="flex flex-col">
                        {showTime && (
                          <div className="text-[10px] text-[var(--color-text-subtle)] text-center my-3 font-medium">
                            {new Date(msg.createdAt).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </div>
                        )}
                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div 
                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                              isMe 
                                ? 'bg-[var(--color-primary)] text-white rounded-br-sm' 
                                : 'bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)] rounded-bl-sm'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                        {isMe && idx === messages.length - 1 && (
                          <div className="text-[10px] text-right mt-1 mr-1 text-[var(--color-text-subtle)]">
                            {msg.isRead ? 'Seen' : 'Delivered'}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input Area */}
              <div className="p-3 bg-[var(--color-card)] border-t border-[var(--color-border)]">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="input flex-1 py-2.5 bg-[var(--color-bg)]"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim() || sending}
                    className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center disabled:opacity-50 hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
                  >
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)]">
              <div className="w-16 h-16 bg-[var(--color-card)] rounded-full flex items-center justify-center mb-4 shadow-sm border border-[var(--color-border)]">
                <MessageSquare size={24} className="text-[var(--color-text-subtle)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">Your Messages</h3>
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
