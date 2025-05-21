import React, { useEffect, useState } from 'react';

function ChatPage() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch mutual matches on load
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/mutualMatches', {
          method: 'GET',
          credentials: 'include'
        });

        const data = await res.json();
        console.log('Mutual matches:', data);
        setMatches(data.matches || []);
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };

    fetchMatches();
  }, []);

  // Fetch messages with selected user
  const fetchMessages = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Select a match to chat with
  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    fetchMessages(match.id);
  };

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedMatch) return;

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          recipientId: selectedMatch.id,
          content: newMessage.trim()
        })
      });

      if (res.ok) {
        const sentMessage = await res.json();
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar with matches */}
      <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px' }}>
        <h3>Your Matches</h3>
        {matches.length > 0 ? (
          matches.map((match) => (
            <div
              key={match.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                cursor: 'pointer',
                backgroundColor: selectedMatch?.id === match.id ? '#eee' : 'transparent'
              }}
              onClick={() => handleSelectMatch(match)}
            >
              <img
                src={match.pic || 'default-pic.jpg'}
                alt={match.name}
                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
              />
              <div>{match.name}</div>
            </div>
          ))
        ) : (
          <p>No matches found.</p>
        )}
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column' }}>
        {selectedMatch ? (
          <>
            <h2>Chat with {selectedMatch.name}</h2>
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  <strong>{msg.sender === 'me' ? 'You' : selectedMatch.name}:</strong> {msg.content}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flex: 1, marginRight: '10px' }}
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a match to start chatting.</p>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
