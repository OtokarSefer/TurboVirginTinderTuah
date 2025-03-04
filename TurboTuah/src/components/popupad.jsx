import React from 'react';
import { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

// It is illegal to add styling before implementing the functionality!!

const Popupad = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});  


    return (
        <div>
            <Popup trigger=
                {<button> Make your account here! </button>} 
                modal nested>
                {
                    close => (
                        <div className='modal'>
                            <div className='content'>
                                Enter sign in details
                            </div>
                            <h1>yes king</h1>
                            <h3>solve the captcha above</h3>
                            <div>
                                <label>Email:</label>
                                <input type="email_signup" value={email} onChange={(e) => setEmail(e.target.value)} />
                                {errors.email && <div className="error">{errors.email}</div>}
                            </div>
                            <div>
                                <label>Password:</label>
                                <input type="password_signup" value={password} onChange={(e) => setPassword(e.target.value)} />
                                {errors.password && <div className="error">{errors.password}</div>}
                            </div>
                            <div>
                                <button>Send details</button>
                                <button onClick=
                                    {() => close()}>
                                        Close modal
                                </button>
                            </div>
                        </div>
                    )
                }
            </Popup>
        </div>
    )
};


export default Popupad