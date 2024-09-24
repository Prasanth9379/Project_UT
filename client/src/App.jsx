import axios from "axios";
import { useEffect, useState } from "react";
import './App.css';
import LoginPage from './Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState([]);
    const [filterUsers, setFilterUsers] = useState([]);
    const [name, setName] = useState('');
    const [mark, setMark] = useState('');
    const [city, setCity] = useState('');
    const [dob, setDob] = useState('');
    const [editId, setEditId] = useState(null);

    const getAllUsers = async () => {
        const res = await axios.get("http://localhost:3000/students");
        setUsers(res.data);
        setFilterUsers(res.data);
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const handleSearchChange = (e) => {
        const searchText = e.target.value.toLowerCase();
        const filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText)
        );
        setFilterUsers(filteredUsers);
    };

    const handleAddOrUpdate = async () => {
        if (editId) {
            await axios.put(`http://localhost:3000/students/${editId}`, { name, mark, city, dob });
            setEditId(null);
        } else {
            await axios.post("http://localhost:3000/students", { id: users.length + 1, name, mark, city, dob });
        }
        setName('');
        setMark('');
        setCity('');
        setDob('');
        getAllUsers();
    };

    const handleEdit = (user) => {
        setName(user.name);
        setMark(user.mark);
        setCity(user.city);
        setDob(user.dob ? new Date(user.dob).toISOString().slice(0, 10) : ''); // Format for input
        setEditId(user.id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:3000/students/${id}`);
        getAllUsers();
    };
    // Handle successful login from LoginPage
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };
    return (
        <div>
            {isAuthenticated ? (
        <div className='container'>
            <h3>Student Management System</h3>
            <div className="input-search">
                <input type="search" placeholder="Search Text Here" onChange={handleSearchChange} />
                <button className="btn green" onClick={handleAddOrUpdate}>{editId ? "Update" : "Add"}</button>
            </div>
            <div className="addcolumn">
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="number" placeholder="Mark" value={mark} onChange={(e) => setMark(e.target.value)} />
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} /> {/* DOB Input */}
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>S.no</th>
                        <th>Name</th>
                        <th>Mark</th>
                        <th>City</th>
                        <th>DOB</th> {/* DOB Column */}
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {filterUsers.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.mark}</td>
                            <td>{user.city}</td>
                            <td>{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</td> {/* Display DOB */}
                            <td>
                                <button className="btn green" onClick={() => handleEdit(user)}>Edit</button>
                            </td>
                            <td>
                                <button className="btn red" onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
            ):(
                <LoginPage onLoginSuccess={handleLoginSuccess}/>
            )}
            </div>
    );
}

export default App;
