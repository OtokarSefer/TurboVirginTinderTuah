import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import './chat.css';

function ChatPage() {
  const [userId, setUserId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();


  useEffect(() => {
    fetch('http://localhost:5000/auth/verify', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) setUserId(data.userId);
      });
  }, []);

    useEffect(() => {
      if (!userId) return;

      // Initialize socket only once
      socketRef.current = io('http://localhost:5000', { withCredentials: true });

      // Identify the user to backend
      socketRef.current.emit('identify', userId);

      // Clear any previous listener before attaching a new one
      socketRef.current.off('receiveMessage');
      socketRef.current.on('receiveMessage', ({ senderId, receiverId, content, timestamp }) => {
        const otherUserId = senderId === userId ? receiverId : senderId;

        setMessages(prevMessages => {
          const updatedMessages = { ...prevMessages };
          if (!updatedMessages[otherUserId]) updatedMessages[otherUserId] = [];
          updatedMessages[otherUserId].push({
            sender: senderId === userId ? 'me' : 'you',
            content,
            timestamp,
          });
          return updatedMessages;
        });
      });

      // Cleanup on unmount or userId change
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }, [userId]);

    useEffect(() => {
      const fetchMatches = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/MutualMatches', {
            method: 'GET',
            credentials: 'include',
          });

          if (!res.ok) return;

          const data = await res.json();
          if (!data || !Array.isArray(data.matches)) {
            setMatches([]);
            return;
          }

          setMatches(data.matches);
        } catch (err) {
          console.error(err);
        }
      };

      fetchMatches();
    }, []);

    const handleSelectMatch = (match) => {
      setSelectedMatch(match);
    };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedMatch) return;

    const message = {
      receiverId: selectedMatch.id,
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    // Emit message to backend
    socketRef.current.emit('sendMessage', message);

    // Update messages locally immediately
    setMessages(prev => {
      const updated = { ...prev };
      if (!updated[selectedMatch.id]) updated[selectedMatch.id] = [];
      updated[selectedMatch.id] = [
        ...updated[selectedMatch.id],
        { sender: 'me', content: message.content, timestamp: message.timestamp },
      ];
      return updated;
    });

    setNewMessage('');
  }

  const selectedMessages = selectedMatch ? messages[selectedMatch.id] || [] : [];

  return (
    <div id="container">
      <aside>
        <ul>
          {matches.length === 0 && (
            <li style={{ padding: '10px', color: '#999' }}>
              No matches found or failed to load matches.
            </li>
          )}
          {matches.map((match) => (
            <li
              key={match.id || Math.random()}
              onClick={() => handleSelectMatch(match)}
              style={{ cursor: 'pointer' }}
            >
              <img
                id="homopilt"
                src={match.pic || 'default-pic.jpg'}
                alt={match.name || 'Unknown'}
                onError={(e) => {
                  e.target.src = 'default-pic.jpg';
                  console.warn(`[ChatPage] Failed to load image for match: ${match.name}`);
                }}
              />
              <div>
                <h2>{match.name || 'Unknown'}</h2>
              </div>
            </li>
          ))}
        </ul>
      </aside>
      <main>
        {selectedMatch ? (
          <>
            <header>
              <img
                id="homopilt"
                src={selectedMatch.pic || 'default-pic.jpg'}
                alt={selectedMatch.name || 'Unknown'}
                onError={(e) => {
                  e.target.src = 'default-pic.jpg';
                  console.warn(`[ChatPage] Failed to load image for selected match: ${selectedMatch.name}`);
                }}
              />
              <div>
                <h2>Chat with {selectedMatch.name || 'Unknown'}</h2>
                <h3>{selectedMessages.length} messages</h3>
              </div>
            </header>
            <ul id="chat">
              {selectedMessages.length === 0 && (
                <li style={{ padding: '10px', color: '#999' }}>No messages yet.</li>
              )}
{selectedMessages.filter((msg, index, arr) => {
  if (index === 0) return true;
  const prev = arr[index - 1];
  return !(msg.content === prev.content && msg.sender === prev.sender);
}).map((msg, index) => (
  <li key={index} className={msg.sender === 'me' ? 'me' : 'you'}>
    <div className="message">{msg.content}</div>
  </li>
))}
            </ul>
            <footer>
              <div className="input-container">
                <textarea
                  placeholder="Type your message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </footer>
          </>
        ) : (
          <p style={{ padding: '20px' }}>Select a match to start chatting.</p>
        )}
      </main>
    </div>
  );
}

export default ChatPage;
 