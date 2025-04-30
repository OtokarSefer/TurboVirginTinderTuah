import Card from "../../components/UI/Card";
import { useState, useEffect } from "react";
import React from "react";


// Should exclude the user, but give him other users to match on the site with
//  how to implement matching? Have a database track the users matches and rejections, and also 
const Match = () => {

    const [matches, setMatches] = useState([]);


    const [randomMatch, setRandomMatch] = useState(null);

    useEffect(() => {
      if (matches && matches.length > 0) {
        const randomIndex = Math.floor(Math.random() * matches.length);
        setRandomMatch(matches[randomIndex]);
      }
    }, [matches]);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/getMatches', {
              method: 'GET',
              credentials: 'include',
            });
            console.log("response", response)
            
            if (!response.ok) {
              throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            console.log("Im not sure what this is", Array.isArray(data));
            console.log(data.matches, data)
            setMatches(data.matches); // just set the matches array
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
      
      fetchUserData();
    }, []);
    
    const handleReject = async (e) => {
      if (matches && matches.length > 0) {
        const randomIndex = Math.floor(Math.random() * matches.length);
        setRandomMatch(matches[randomIndex])
      }
      const response = await fetch('http://localhost:5000/api/Reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include", 
        body: JSON.stringify({ userId: randomMatch.id}),}
      );
      console.log("response", response)
      
      
    }

    const handleAccept = async (e) => {
      if (matches && matches.length > 0) {
        const randomIndex = Math.floor(Math.random() * matches.length);
        setRandomMatch(matches[randomIndex])
      }
      const response = await fetch('http://localhost:5000/api/Accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include", 
        body: JSON.stringify({ userId: randomMatch.id}),}
      );
      console.log("response", response)
    }

    if (!matches) {
        return <div>Loading...</div>; 
    }

    if (matches.length === 0) {
      return <div>No matches found</div>;
    }
    
    return (
      <div className="match">
        <h1>Swipe for the love of your life</h1>
        <br />
        {randomMatch && (
          <Card key={randomMatch.id}>
            <img src={randomMatch.pic} alt="Users prole pic" />
            <p>Name: {randomMatch.name}</p>
            <p>Age: {randomMatch.age || 'Age not available'}</p>
            <p>Gender: {randomMatch.gender}</p>
            <p>BIO: {randomMatch.bio}</p>
            <button onClick={() => handleAccept(randomMatch.id)}>Accept into ur life</button>
            <button onClick={() => handleReject(randomMatch.id)}>Reject</button>
          </Card>
        )}

      </div>
    );
  }

export default Match;
