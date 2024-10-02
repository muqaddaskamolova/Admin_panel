import {useEffect, useState} from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";

export const Dashboard = () => {
    const [name, setName] = useState('');
    const [navigate, setNavigate] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const {data} = await axios.get('http://localhost:3000/api/user');

                setName(data.name);
            } catch (e) {
                setNavigate(true);
            }
        })();
    }, []);

    const logout = async () => {
        await axios.post('http://localhost:3000/api/logout', {}, {withCredentials: true});

        setNavigate(true);
    }

    if (navigate) {
        return <Navigate to="/login"/>;
    }

    return <div className="form-signin mt-5 text-center">
        <h3>My Dashboard {name}</h3>
        <button className="btn btn-lg btn-primary" onClick={logout}>Logout</button>
        
    </div>
}
export default Dashboard;
