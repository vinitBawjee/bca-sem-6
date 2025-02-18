import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AddStudent = () => {
    const [student, setStudent] = useState({ name: "", email: "", age: "", course: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, student);
            navigate("/");
        } catch (error) {
            console.error("Error adding student:", error);
        }
    };

    return (
        <div>
            <h2>Add Student</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
                <input type="text" name="course" placeholder="Course" onChange={handleChange} required />
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default AddStudent;
