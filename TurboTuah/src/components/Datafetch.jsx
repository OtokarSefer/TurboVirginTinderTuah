import { useState, useEffect } from 'react';
import './Loginform.css';


const Datafetch = () => {
  const [data, setData] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/users');
        const data = await res.json();
        setData(data);
        console.log('Fetched users', data)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>TinderTuah users</h1>
    </>
  );
};

export default Datafetch;