import React, { useState, useEffect } from "react";
import Card from "../components/UI/Card";
import Popup from "reactjs-popup";
import './home.css'

//  There should be a default profile pic, and also the ability to add a description, age

const Home = () => {

  const [userData, setUserData] = useState(null);
  const [errors, setErrors] = useState({});
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getUser', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
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
      if (!name) validationErrors.name = 'Name is required.';
      if (!age || age < 18 || age > 100) {
        validationErrors.age = 'Age must be between 18 and 99.';
      }
      if (gender !== 'M' && gender !== 'F') {
        validationErrors.gender = 'Gender must be either "M" or "F".';
      }
      if (!bio) {
        validationErrors.bio = 'Bio is required.';
      }
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      const updatedData = {name, age, gender, bio}

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
    };



    if (!userData) {
      return <div>Loading...</div>;
    }
  return (
    <div>
      <h1>Profile</h1>
      <Card>
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" alt="Profile pic"/>
      <br/>
      <div>add picture</div>

      <div>
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
        <p>Age: {userData.age ? userData.age : 'Age not available'}</p>
        <p>Gender: {userData.gender}</p>
        <p>BIO: {userData.bio}</p>
      </div>

      <br />
      {/* This should call back to the api, and let the change stuff */}
      <Popup trigger={<button>Change data</button>} modal nested>
              {(close) => (
                <>
                  <form onSubmit={handleChanges}>
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
                    <button type="submit">Yes</button>
                  </form>
                </>
              )}
      </Popup>

      </Card>
    </div>
  );
};

export default Home;
