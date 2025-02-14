import { useState, useEffect } from 'react';
import './Loginform.css';
import Card from './UI/Card'
import Datafetch from './Datafetch'

const Loginform = () => {
  return (
    <Card className='Loginform'>
      <Datafetch/>
      <input type="text" name="" id="" placeholder='enter name'/>
      <input type="text" name="" id="" placeholder='enter password'/>
    </Card>
  );
};

export default Loginform;