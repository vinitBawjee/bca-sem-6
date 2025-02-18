import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const EditStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState({ name: "", email: "", age: "", course: "" });

    useEffect(() => {
        fetchStudent();
    }, []);

    const fetchStudent = async () => {
        try {
            const response = await axios.get(`${API_URL}${id}`);
            setStudent(response.data);
        } catch (error) {
            console.error("Error fetching student:", error);
        }
    };

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}${id}`, student);
            navigate("/");
        } catch (error) {
            console.error("Error updating student:", error);
        }
    };

    return (
        <div>
            <h2>Edit Student</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={student.name} onChange={handleChange} required />
                <input type="email" name="email" value={student.email} onChange={handleChange} required />
                <input type="number" name="age" value={student.age} onChange={handleChange} required />
                <input type="text" name="course" value={student.course} onChange={handleChange} required />
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditStudent;
