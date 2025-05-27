import React, { useEffect, useState } from 'react';
import './chat.css';

function ChatPage() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      console.log('[ChatPage] Fetching user matches...');
      try {
        const res = await fetch('http://localhost:5000/api/MutualMatches', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          console.error(`[ChatPage] Failed to fetch matches: ${res.status} ${res.statusText}`);
          return;
        }

        const data = await res.json();
        if (!data) {
          console.warn('[ChatPage] No data returned from /api/getUser');
          return;
        }

        if (!Array.isArray(data.matches)) {
          console.warn('[ChatPage] data.matches is not an array:', data.matches);
          setMatches([]);
          return;
        }

        console.log(`[ChatPage] Received ${data.matches.length} matches.`);
        setMatches(data.matches);
      } catch (err) {
        console.error('[ChatPage] Error fetching matches:', err);
      }
    };

    fetchMatches();
  }, []);

  const handleSelectMatch = (match) => {
    if (!match) {
      console.warn('[ChatPage] handleSelectMatch called with invalid match:', match);
      return;
    }
    console.log(`[ChatPage] Match selected: ${match.name} (id: ${match.id})`);
    setSelectedMatch(match);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      console.warn('[ChatPage] Tried to send empty message.');
      return;
    }
    if (!selectedMatch) {
      console.warn('[ChatPage] Tried to send message but no match is selected.');
      return;
    }

    const newMsg = {
      sender: 'me',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => {
      const updated = { ...prev };
      const id = selectedMatch.id;

      if (!id) {
        console.error('[ChatPage] Selected match has no id:', selectedMatch);
        return prev;
      }

      if (!updated[id]) {
        updated[id] = [];
      }

      updated[id] = [...updated[id], newMsg];

      console.log(`[ChatPage] Message sent to match id=${id}: "${newMsg.content}"`);

      return updated;
    });

    setNewMessage('');
  };

  const selectedMessages = selectedMatch ? messages[selectedMatch.id] || [] : [];

  return (
    <div id="container">
      <aside>
        <header>
          <input type="text" placeholder="search" />
        </header>
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
              {selectedMessages.map((msg, index) => (
                <li key={index} className={msg.sender === 'me' ? 'me' : 'you'}>
                  <div className="entete">
                    <h2>{msg.sender === 'me' ? 'You' : selectedMatch.name || 'Unknown'}</h2>
                    <h3>{msg.timestamp || 'Unknown time'}</h3>
                  </div>
                  <div className="triangle"></div>
                  <div className="message">{msg.content}</div>
                </li>
              ))}
            </ul>
            <footer>
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
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                Send
              </a>
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
