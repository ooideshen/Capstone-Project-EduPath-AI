'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, TextField, Button, Typography, CircularProgress, Avatar, IconButton } from '@mui/material';
import { Send, Bot, User, ArrowLeft, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getCookie, useAuth } from '@/app/context/AuthContext';
import { API_URL } from '@/app/utils/api';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function ChatComponent() {
  const router = useRouter();
  const { user } = useAuth();
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]); 
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const getStorageKey = () => user ? `edupath_student_chat_history_${user.id}` : null;

  useEffect(() => {
    if (!user) return; 

    localStorage.removeItem('edupath_student_chat_history');

    const key = `edupath_student_chat_history_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse chat history from localStorage', e);
        setMessages([]);
      }
    } else {
      setMessages([]); 
    }
  }, [user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const updateMessages = (newMessages: Message[] | ((prev: Message[]) => Message[])) => {
    setMessages((prev) => {
      const next = typeof newMessages === 'function' ? newMessages(prev) : newMessages;
      const key = getStorageKey();
      if (key) {
        localStorage.setItem(key, JSON.stringify(next));
      }
      return next;
    });
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      const key = getStorageKey();
      if (key) {
        localStorage.removeItem(key);
      }
    }
  };

  const handleSendPrompt = async () => {
    if (!userInput.trim() || loading) return;

    const userPrompt = userInput.trim();
    setUserInput(''); 

    updateMessages((prev) => [...prev, { sender: 'user', text: userPrompt }]);
    setLoading(true);

    try {
      const token = getCookie('accessToken');
      const response = await fetch(`${API_URL}/api/open-router/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          prompt: userPrompt,
          history: messages
        }),
      });

      if (!response.ok) throw new Error('Backend server error');

      const rawText = await response.text();
      let finalResponse = rawText;

      try {
        const parsedData = JSON.parse(rawText);
        if (typeof parsedData === 'object' && parsedData !== null) {
          finalResponse = JSON.stringify(parsedData, null, 2);
        }
      } catch (e) {
      }

      updateMessages((prev) => [...prev, { sender: 'ai', text: finalResponse }]);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to parse response or backend error:', error);
      updateMessages((prev) => [...prev, { sender: 'ai', text: `⚠️ Error: ${errorMsg}. Please check backend logs.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100vh - 120px)',
      minHeight: '500px',
      bgcolor: 'white', 
      border: '1px solid #E2E8F0',
      borderRadius: '24px',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
    }}>
      
      <Box sx={{ 
        px: 3, 
        py: 2.5, 
        bgcolor: 'white', 
        borderBottom: '1px solid #E2E8F0', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => router.back()} 
            sx={{ 
              color: '#64748B', 
              bgcolor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              p: 1.2,
              transition: 'all 0.2s',
              '&:hover': { bgcolor: '#F1F5F9', color: '#1A1A1A' } 
            }}
          >
            <ArrowLeft size={18} />
          </IconButton>
          
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1A1A1A', letterSpacing: '0px', fontSize: '1.05rem' }}>
              EduPath AI Engine
            </Typography>
            <Typography sx={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981' }}></Box>
              Online
            </Typography>
          </Box>
        </Box>

        {messages.length > 0 && (
          <IconButton
            onClick={handleClearChat}
            title="Clear Chat History"
            sx={{
              color: '#EF4444',
              bgcolor: '#FEF2F2',
              borderRadius: '12px',
              border: '1px solid #FECACA',
              p: 1.2,
              transition: 'all 0.2s',
              '&:hover': { bgcolor: '#FEE2E2', color: '#DC2626' }
            }}
          >
            <Trash2 size={18} />
          </IconButton>
        )}
      </Box>

      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        p: { xs: 2, sm: 4 }, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 4,
        bgcolor: '#F8FAFC',
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#CBD5E1', borderRadius: '4px' }
      }}>
        
        {messages.length === 0 && (
          <Box sx={{ m: 'auto', textAlign: 'center', maxWidth: '400px' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
               <Bot size={32} color="#0062FE" />
            </Box>
            <Typography sx={{ color: '#1A1A1A', fontWeight: 700, fontSize: 18, mb: 1 }}>
              How can I help you today?
            </Typography>
            <Typography variant="body2" color="#64748B">
              Ask me about your academic pathways, university comparisons, or career guidance.
            </Typography>
          </Box>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                flexDirection: isUser ? 'row-reverse' : 'row', 
                alignItems: 'flex-start', 
                gap: 2,
                maxWidth: isUser ? '75%' : '90%',
                alignSelf: isUser ? 'flex-end' : 'flex-start'
              }}
            >
            
              <Avatar sx={{ 
                bgcolor: isUser ? '#0062FE' : '#white', 
                border: `1px solid ${isUser ? '#0062FE' : '#E2E8F0'}`,
                boxShadow: isUser ? '0 4px 10px rgba(0,98,254,0.2)' : '0 2px 5px rgba(0,0,0,0.05)',
                width: 40, 
                height: 40 
              }}>
                {isUser ? <User size={20} color="#fff" /> : <Bot size={20} color="#0062FE" />}
              </Avatar>

              <Box sx={{ 
                p: 2.5, 
                borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                bgcolor: isUser ? '#0062FE' : 'white',
                border: `1px solid ${isUser ? '#0062FE' : '#E2E8F0'}`,
                boxShadow: isUser ? '0 8px 20px rgba(0, 98, 254, 0.15)' : '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                {isUser ? (
                  <Typography variant="body1" sx={{ color: 'white', fontSize: '0.95rem', whiteSpace: 'pre-wrap', fontWeight: 500 }}>
                    {msg.text}
                  </Typography>
                ) : (
                  <Box sx={{ 
                    color: '#334155',
                    lineHeight: 1.7,
                    fontSize: '0.95rem',
                    '& h1, & h2, & h3': { color: '#1A1A1A', mt: 1.5, mb: 1, fontWeight: 700 },
                    '& h3': { fontSize: '1.15rem' },
                    '& p': { mb: 1 },
                    '& ul, & ol': { pl: 2.5, mb: 1 },
                    '& li': { mb: 0.5 },
                    '& strong': { color: '#0062FE', fontWeight: 700 },
                    '& code': { bgcolor: '#F1F5F9', px: 0.8, py: 0.2, borderRadius: '6px', color: '#EF4444', fontFamily: 'monospace', border: '1px solid #E2E8F0' }
                  }}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, alignSelf: 'flex-start' }}>
            <Avatar sx={{ bgcolor: 'white', border: '1px solid #E2E8F0', width: 40, height: 40, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <Bot size={20} color="#0062FE" />
            </Avatar>
            <Box sx={{ px: 3, py: 2, bgcolor: 'white', border: '1px solid #E2E8F0', borderRadius: '4px 16px 16px 16px', display: 'flex', alignItems: 'center', gap: 1.5, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <CircularProgress size={16} sx={{ color: '#0062FE' }} />
              <Typography variant="body2" sx={{ color: '#64748B', fontStyle: 'italic', fontWeight: 500 }}>AI is typing...</Typography>
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #E2E8F0', display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          variant="outlined"
          size="small"
          placeholder="Ask EduPath AI anything..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendPrompt();
            }
          }}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#1A1A1A',
              bgcolor: '#F8FAFC',
              borderRadius: '16px',
              py: 1.5,
              px: 2,
              transition: 'all 0.2s ease',
              '& fieldset': { borderColor: '#E2E8F0' },
              '&:hover fieldset': { borderColor: '#CBD5E1' },
              '&.Mui-focused fieldset': { borderColor: '#0062FE', boxShadow: '0 0 0 4px rgba(0,98,254,0.1)' },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendPrompt}
          disabled={loading || !userInput.trim()}
          sx={{
            bgcolor: '#0062FE',
            '&:hover': { bgcolor: '#0050D1', boxShadow: '0 8px 20px rgba(0,98,254,0.3)' },
            '&.Mui-disabled': { bgcolor: '#E2E8F0', color: '#94A3B8' },
            minWidth: '54px',
            height: '50px',
            borderRadius: '14px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(0,98,254,0.2)'
          }}
        >
          <Send size={18} />
        </Button>
      </Box>
    </Box>
  );
}