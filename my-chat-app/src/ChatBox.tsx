import React, {useEffect, useState} from 'react';
import {io, Socket} from 'socket.io-client';
import axios from 'axios';
import {Message} from './types';

const socket: Socket = io('http://localhost:3001'); // NestJS WebSocket port

const ChatBox: React.FC = () => {
  const [sender, setSender] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    console.log('📡 WebSocket connection started');

    socket.on('message', (message: Message) => {
      console.log('📥 Message received via WebSocket:', message);

      // Add only user messages (not AI-generated ones)
      if (!message.isGenerated) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('message');
      console.log('🔌 WebSocket connection closed');
    };
  }, []);

  const sendMessage = async () => {
    if (!sender.trim() || !text.trim()) {
      console.warn('⚠️ Username or message is empty, canceled.');
      return;
    }

    const userMsg: Message = {
      sender,
      text,
      isGenerated: false,
    };

    console.log('✉️ Sending user message:', userMsg);

    // Do not add it locally; wait for it to return via WebSocket
    socket.emit('message', userMsg);
    console.log('📡 Message sent via WebSocket');

    const loadingMsg: Message = {
      sender: 'AI',
      text: 'Typing...',
      isGenerated: true,
    };

    setMessages((prev) => [...prev, loadingMsg]);
    console.log('⏳ "Typing..." message added');

    try {
      console.log('🔗 Calling FastAPI...');
      const response = await axios.post('http://localhost:8000/ai', {
        message: text,
      });
      console.log('✅ FastAPI response:', response.data);

      const aiMsg: Message = {
        sender: 'AI',
        text: response.data.response,
        isGenerated: true,
      };

      setMessages((prev) => {
        const updated = [...prev];
        const index = updated.findIndex(
            (m) => m.sender === 'AI' && m.text === 'Typing...'
        );
        if (index !== -1) updated.splice(index, 1);
        return [...updated, aiMsg];
      });

      console.log('🤖 AI response added to chat:', aiMsg);
    } catch (err: any) {
      console.error(
          '❌ FastAPI error:',
          err.response?.data || err.message || err
      );

      setMessages((prev) => [
        ...prev.filter((m) => m.text !== 'Typing...'),
        {
          sender: 'AI',
          text: '[Error in AI response]',
          isGenerated: true,
        },
      ]);
    }

    setText('');
  };

  return (
      <div className="chat-container">
        <h1>Realtime Chat + AI</h1>
        <div className="input-group">
          <input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="Your name"
          />
          <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        <ul>
          {messages.map((msg, i) => (
              <li key={i} className={msg.isGenerated ? 'ai' : 'user'}>
                <div className="message-row">
                  <span className="avatar">{msg.isGenerated ? '🤖' : '👤'}</span>
                  <div className="bubble">
                    <strong>{msg.sender}:</strong> {msg.text}
                  </div>
                </div>
              </li>
          ))}
        </ul>
      </div>
  );
};

export default ChatBox;
