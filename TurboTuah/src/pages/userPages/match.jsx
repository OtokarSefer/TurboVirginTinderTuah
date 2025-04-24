import Card from "../../components/UI/Card";
import { useState, useEffect } from "react";
import React from "react";


// Should exclude the user, but give him other users to match on the site with
//  how to implement matching? Have a database track the users matches and rejections, and also 
const Match = () => {

    const [matches, setMatches] = useState([]);


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
    
    const handleReject = async (id) => {
      console.log("no", id)
    }

    const handleAccept = async (id) => {
      console.log("yes", id)
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
        {matches.map((currentUser) => (
          <Card key={currentUser.id}>
            <p>Name: {currentUser.name}</p>
            <p>Age: {currentUser.age || 'Age not available'}</p>
            <p>Gender: {currentUser.gender}</p>
            <p>BIO: {currentUser.bio}</p>
            <button onClick={() => handleAccept(currentUser.id)}>Accept into ur life</button>
            <button onClick={() => handleReject(currentUser.id)}>Reject</button>
          </Card>
        ))}
      </div>
    );
  }

export default Match;
