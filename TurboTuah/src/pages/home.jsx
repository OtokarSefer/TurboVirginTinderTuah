import React, { useState, useEffect, useRef } from "react";
import Card from "../components/UI/Card";
import Popup from "reactjs-popup";
import './home.css'

//  There should be a default profile pic, and also the ability to add a description, age
const Home = () => {
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [newPic, setNewPic] = useState('');
  const [userData, setUserData] = useState(null);
  const [errors, setErrors] = useState({});
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [genderPref, setgenderPreferences] = useState('');
  const [minAgeP, setminAgeP] = useState('');
  const [maxAgeP, setmaxAgeP] = useState('');



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getUser', {
          method: 'GET',
          credentials: 'include',
        }
      );

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log("This is the data", data)
        setUserData(data);
        console.log("This is the data pic", data.pic)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

      fetchUserData();
    }, []);


    const handleChanges = async (e) => {
      e.preventDefault()
      console.log("hello!")
      setErrors({});
      let validationErrors = {};
      if (age !== undefined) {
        if (age < 18 || age > 99) {
          validationErrors.age = 'Age must be between 18 and 99.';
        }
      }
      if (age !== undefined && age !== '') {
        if (age < 18 || age > 99) {
          validationErrors.age = 'Age must be between 18 and 99.';
        }
      }
      if (gender !== undefined && gender !== '') {
        const g = gender.toUpperCase();
        if (g !== 'M' && g !== 'F') {
          validationErrors.gender = 'Gender must be either "M" or "F".';
        }
      }
      if (minAgeP !== undefined && minAgeP !== '') {
        if (minAgeP < 18 || minAgeP > 99) {
          validationErrors.minAgeP = 'Minimum age preference must be between 18 and 99.';
        }
      }
      if (maxAgeP !== undefined && maxAgeP !== '') {
        if (maxAgeP < 18 || maxAgeP > 99) {
          validationErrors.maxAgeP = 'Maximum age preference must be between 18 and 99.';
        }
      }
      if (
        minAgeP !== undefined && minAgeP !== '' &&
        maxAgeP !== undefined && maxAgeP !== ''
      ) {
        if (parseInt(maxAgeP) <= parseInt(minAgeP)) {
          validationErrors.minmax = 'Maximum age preference must be higher than minimum age preference.';
        }
      }
      if (genderPref !== undefined && genderPref !== '') {
        const gp = genderPref.toUpperCase();
        if (gp !== 'M' && gp !== 'F' && genderPref !== 'Any') {
          validationErrors.genderPref = 'Gender preference must be either "M", "F", or "Any".';
        }
      }   
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      const updatedData = {name, gender, bio, age, minAgeP, maxAgeP, genderPref}
      console.log(updatedData)
      try {
        const response = await fetch("http://localhost:5000/api/Changeuser", {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include", 
          body: JSON.stringify(updatedData)
        });
  
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error verifying session:", error);
      }
      location.reload()
    };




    if (!userData) {
      return <div>Loading...</div>;
    }

    


  return (
    <div>
      <h1>Profile</h1>
      <Card>
      <Popup trigger={<img src={newPic || userData.pic} className="profilepic" alt="default profile picture" />} modal nested>
        <div id="sigmaMale">
          <h3>Profile Info</h3>
          
          <img src={newPic || userData.pic} alt="Current profile" style={{ width: "50%", borderRadius: "50%" }} />
          <input
            type="text"
            placeholder="Enter new image URL"
            value={newPic}
            onChange={(e) => setNewPic(e.target.value)}
          />
          <button
            onClick={async () => {
              if (!newPic) return;
              try {
                const response = await fetch("http://localhost:5000/api/Changeuser", {
                  method: "PATCH",
                  headers: { 'Content-Type': 'application/json' },
                  credentials: "include",
                  body: JSON.stringify({ pic: newPic }),
                });

                if (response.ok) {
                  // Refetch or update state manually
                  const updated = await response.json();
                  setUserData(updated);
                  setNewPic('');
                } else {
                  console.error("Failed to update picture");
                }
              } catch (error) {
                console.error("Error updating picture:", error);
              }
              location.reload()
            }}
          >
            Update Picture
          </button>
        </div>
      </Popup>
      <div>
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
        <p>Age: {userData.age ? userData.age : 'Enter your age'}</p>
        <p>Gender: {userData.gender ? userData.gender: 'Enter your gender'}</p>
        <p>BIO: {userData.bio ? userData.bio : 'Enter your bio'}</p>
        {
          userData.genderPref && userData.min && userData.max && (
            <p>Looking for: {userData.genderPref} in ages between {userData.min} - {userData.max}</p>
          )
        }

      </div>

      <br />
      {/* This should call back to the api, and let the change stuff */}
      <Popup trigger={<button>Edit data</button>} modal nested>
              {(close) => (
                <>
                  <form onSubmit={handleChanges} id="editData">
                    {errors.global && <div className="alert">{errors.global}</div>}
                    <input
                      type="text"
                      placeholder="Change name"
                      value={name}
                      onChange={(e) => setName(e.target.value)} 
                    />
                    {errors.name && <div className="error">{errors.name}</div>}
                    <input
                      type="number"
                      placeholder="Enter age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)} 
                    />
                    {errors.age && <div className="error">{errors.age}</div>}
                    <input
                      type="text"
                      placeholder="Enter gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)} 
                    />
                    {errors.gender && <div className="error">{errors.gender}</div>}
                    <input
                      type="text"
                      placeholder="Enter bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)} 
                    />
                    {errors.bio && <div className="error">{errors.bio}</div>}
                    <input
                      type="number"
                      placeholder="Enter min age preference"
                      value={minAgeP}
                      onChange={(e) => setminAgeP(e.target.value)} 
                    />
                    {errors.min && <div className="error">{errors.min}</div>}
                    <input
                      type="number"
                      placeholder="Enter max age preference"
                      value={maxAgeP}
                      onChange={(e) => setmaxAgeP(e.target.value)} 
                    />
                    {errors.max && <div className="error">{errors.max}</div>}
                    
                    
                    {errors.minmax && <div className="error">{errors.minmax}</div>}


                    <input
                      type="text"
                      placeholder="Enter your gender preferences"
                      value={genderPref}
                      onChange={(e) => setgenderPreferences(e.target.value)} 
                    />
                    {errors.genderPref && <div className="error">{errors.genderPref}</div>}
                    <button type="submit">Yes</button>
                  </form>

                </>
              )}
      </Popup>

      </Card>
      <hr />
      Pending matches

      <Card>
        Not another card
        <hr />
        <p>Matches:</p>
        {userData.matches && userData.matches.length > 0 ? (
          <ul>
            {userData.matches.map((match, index) => (
              <li key={index}>
                <p><strong>{match.name}</strong></p>
                <p>Age: {match.age}</p>
                <p>Bio: {match.bio}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No matches yet</p>
        )}
      </Card>

    </div>
  );
};

export default Home;
