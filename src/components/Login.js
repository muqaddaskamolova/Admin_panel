// Login.js

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
    const [phonenumber, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const loginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('https://api.dezinfeksiyatashkent.uz/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone_number: phonenumber,
                    password: password,
                }),
            });

            const element = await response.json();

            if (element?.success === true) {
                localStorage.setItem('mytoken', element?.data?.tokens?.accessToken?.token);
                toast.success('Login successful!');
                
                // Delay for token to sync properly
                setTimeout(() => {
                    navigate('/dashboard');
                }, 5000); 
            } else {
                toast.error(element?.message || 'Login failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while trying to log in.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container" style={formContainerStyle}>
                <h1 style={titleStyle}>Sign In</h1>
                <form onSubmit={loginSubmit} style={formStyle}>
                    <div style={inputGroupStyle}>
                        <label htmlFor="number" style={labelStyle}>Phonenumber:</label>
                        <input
                            type="number"
                            id="number"
                            autoComplete="off"
                            onChange={(e) => setNumber(e.target.value)}
                            value={phonenumber}
                            required
                            style={inputStyle}
                            minLength={7}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label htmlFor="password" style={labelStyle}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            style={inputStyle}
                            minLength={4}
                        />
                    </div>

                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <ToastContainer />
                
                <p style={footerTextStyle}>
                    Need an Account?{' '}
                    <span className="line">
                        <Link to="/register" style={linkStyle}>Sign Up</Link>
                    </span>
                </p>
            </div>
        </div>
    );
};

// Inline Styles
const formContainerStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
};

const titleStyle = {
    marginBottom: '20px',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
};

const inputGroupStyle = {
    marginBottom: '15px',
    textAlign: 'left',
};

const labelStyle = {
    marginBottom: '5px',
    display: 'block',
    fontWeight: 'bold',
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
};

const buttonStyle = {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

const footerTextStyle = {
    marginTop: '20px',
};

const linkStyle = {
    color: '#007bff',
    textDecoration: 'none',
};

// Exporting the component
export default Login;
