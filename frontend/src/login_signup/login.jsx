import { useState } from 'react';
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { Messages } from "primereact/messages";
import { useRef } from "react";

import axios from "axios";
import css from './login_signup.module.css';

export default function Login() {
    const msgs = useRef(null);
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ email: '', password: '', role: '' });

    const validateField = (name, value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let errorMessage = "";
        const fieldValue = typeof value === "string" ? value.trim() : value;
        if (!fieldValue) {
            errorMessage = "This field is required.";
        } else if (name === "email" && !emailRegex.test(fieldValue)) {
            errorMessage = "Invalid email format.";
        }
        return errorMessage;
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target || e; 
        setFormData({ ...formData, [name]: value });
    
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value),
        }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = {};
        for (const field in formData) {
            formErrors[field] = validateField(field, formData[field]);
        }
        setErrors(formErrors);

        if (Object.values(formErrors).every((error) => !error)) {
            try {
                const response = await axios.post( `${import.meta.env.VITE_REACT_APP_BACKEND_URL}home/login`, formData );
                if (response.status === 200) {
                    const token = response.data.token;
                    const user = response.data.user;
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                    setFormData({
                        email: "",
                        password: "",
                        role: ""
                    })
                    if (response.data.user.role === "user") {
                        navigate("/"); 
                    } else if (response.data.user.role === "seller") {
                        navigate("/seller"); 
                    }

                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
                console.error("Error submitting form:", errorMessage);
        
                msgs.current.show([
                    { severity: "error", summary: "Error", detail: errorMessage, life: 7000 },
                ]);
            }
        }
    };

    const dropdownOptions = [
        { name: 'User', code: 'user' },
        { name: 'Seller', code: 'seller' },
        { name: 'Admin', code: 'admin' },
    ];

    return (
        <div className={`${css['main_body']} flex-column gap-2 d-flex justify-content-center align-items-center`}>
            <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 1000 }}>
                <Messages ref={msgs} />
            </div>
            <form className={`${css['login_form']} border rounded d-flex flex-column justify-content-evenly px-3`} onSubmit={handleSubmit}>
                <h1 className='text-start'>login</h1>
                <div>
                    <div className={`${css['login_form_field']} d-flex flex-column`}>
                        <label htmlFor="email">Email</label>
                        <div>
                            <InputText id="email" name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} className={`${errors.email ? "p-invalid" : ""} w-100`}/>
                            <div>{errors.email && <small className="p-error">{errors.email}</small>}</div>
                        </div>
                    </div>
                    <div className={`${css['login_form_field']} d-flex flex-column`}>
                        <label htmlFor="password">Password</label>
                        <div>
                            <InputText id="password" name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} className={`${errors.password ? "p-invalid" : ""} w-100`}/>
                            <div>{errors.password && <small className="p-error">{errors.password}</small>}</div>
                        </div>
                    </div>
                    <div className={`${css['login_form_field']} d-flex flex-column`}>
                        <label htmlFor="role">Role</label>
                        <Dropdown  name="role" value={formData.role} options={dropdownOptions} onChange={(e) => handleChange({ name: "role", value: e.value })} className={`${errors.role ? "p-invalid" : ""} w-100`} optionLabel="name" placeholder="Select Role" aria-describedby="role-help"/>
                        <div>{errors.role && <small className="p-error">{errors.role}</small>}</div>
                    </div>
                    <div> <button type="submit" className="btn btn-primary w-100">Submit</button> </div>
                </div>
                <div></div>
            </form>
            <div className={`${css['login_link']} card p-2 text-start`}>
                <span>Want to join as a User? <Link to="/signup_user" className="text-primary">Sign up here</Link></span>
                <span>Looking to sell your products? <Link to="/signup_seller" className="text-primary">Register as a Seller</Link></span>
            </div>
        </div>
    );
}
