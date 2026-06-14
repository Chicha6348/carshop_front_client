import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [passportSeries, setPassportSeries] = useState('');
    const [adress, setAdress] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            // Validation checks
            if (!fullname || !email || !password || !confirmPassword || !phone || !passportNumber || !passportSeries || !adress) {
                setError('Please fill in all fields.');
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            // Send data to backend for sign-up
            const response = await axios.post('http://localhost:8080/auth/signup', {
                fullName: fullname,
                email,
                password,
                phone,
                passportNumber,
                passportSeries,
                adress,
            });

            console.log(response.data);
            if (response.data.status === true) {
                navigate('/login'); // Redirect to login page on successful sign-up
            } else {
                setError(response.data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Signup failed:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-container" style={{marginTop:'-50px', marginBottom:'-50px'}}>
            <div className="signup-box">
                <h2 className="signup-title">Sign Up</h2>
                {error && <p className="signup-error">{error}</p>}
                <div className="signup-field">
                    <label htmlFor="fullname">Full Name:</label>
                    <input
                        type="text"
                        id="fullname"
                        placeholder="Enter full name"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="passportNumber">Passport Number:</label>
                    <input
                        type="text"
                        id="passportNumber"
                        placeholder="Enter passport number"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="passportSeries">Passport Series:</label>
                    <input
                        type="text"
                        id="passportSeries"
                        placeholder="Enter passport series"
                        value={passportSeries}
                        onChange={(e) => setPassportSeries(e.target.value)}
                    />
                </div>
                <div className="signup-field">
                    <label htmlFor="adress">Address:</label>
                    <input
                        type="text"
                        id="adress"
                        placeholder="Enter address"
                        value={adress}
                        onChange={(e) => setAdress(e.target.value)}
                    />
                </div>
                <button className="signup-button" onClick={handleSignup}>
                    Sign Up
                </button>
                <div className="signup-footer">
                    <p>Already have an account? <a href="/login">Login here</a></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
