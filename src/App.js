import './App.css';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'; // Removed useNavigate from here
import {  useEffect } from 'react';
import axios from 'axios'; // Ensure axios is imported
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <header className="p-3 bg-dark text-white">
                
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                            <li><Link to="/dashboard" className="nav-link px-2 text-white">Dashboard</Link></li>
                        </ul>
                        <div className="text-end">
                            <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
                            <Link to="/register" className="btn btn-outline-light me-2">Register</Link>
                        </div>
                    </div>
                
            </header>

            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedComponent />} /> {/* Move the protected logic here */}
            </Routes>
        </BrowserRouter>
    );
}

// Move the authentication logic to a protected component
function ProtectedComponent() {
    const navigate = useNavigate(); // Correctly inside a component rendered by <BrowserRouter>

    useEffect(() => {
        const token = localStorage.getItem('mytoken');
        (async () => {
            try {
                const { data } = await axios.get('https://api.dezinfeksiyatashkent.uz/api/', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Correct Authorization header
                    }
                });

                if (data?.success) {
                    navigate('/dashboard'); // Navigate to dashboard if the token exists
                } else {
                    navigate('/login'); // Redirect to login if not successful
                }
            } catch (e) {
                navigate('/login'); // Navigate to login on error
            }
        })();
    }, [navigate]); // Correct dependency on `navigate`

    return null; // This component won't render anything on its own
}

export default App;
