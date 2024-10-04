import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
    const [phonenumber, setNumber] = useState('');
    const [password, setPassword] = useState('');
    
    const loginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://api.dezinfeksiyatashkent.uz/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Corrected content type
                },
                body: JSON.stringify({ 
                    phone_number: phonenumber,
                    password: password
                })
            });

            const element = await response.json();

            console.log(JSON.stringify(element)); // Moved console.log outside of the body

            if (element?.success === true) {
                localStorage.setItem('mytoken', element?.data?.tokens?.accessToken?.token);
                toast.success(element?.message);
                navigate('/dashboard');
            } else {
                toast.error(element?.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while trying to log in.');
        }
    };

    return (
        <section>
            <h1>Sign In</h1>
            <form>
                <label htmlFor="number">Phonenumber:</label>
                <input
                    type="number"
                    id="number"
                    autoComplete="off"
                    onChange={(e) => setNumber(e.target.value)}
                    value={phonenumber}
                    required minLength={7}
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required minLength={4}
                />
                <button onClick={loginSubmit}>Sign In</button>
            </form>
            <ToastContainer />
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>
    );
};

export default Login;
