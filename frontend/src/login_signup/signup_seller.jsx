import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Messages } from "primereact/messages";
import { useRef } from "react";
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';

import axios from "axios";
import css from "./login_signup.module.css";

export default function Signup_User() {
    let maxDate = new Date();
    const msgs = useRef(null);

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        full_name: "",
        user_name: "",
        email: "",
        address: "",
        phone_number: "",
        dob: "",
        profile_photo: "",
        password: "",
        confirm_password: "" 
    });

    const validateField = (name, value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        let errorMessage = "";

        if (typeof value === "string" && !value.trim()) {
            errorMessage = "This field is required.";
        } else if (name === "email" && !emailRegex.test(value)) {
            errorMessage = "Invalid email format.";
        } else if (name === "phone_number" && !phoneRegex.test(value)) {
            errorMessage = "Invalid phone number.";
        } else if (name === "confirm_password" && value !== formData.password) { // Match key name here
            errorMessage = "Passwords do not match!";
        }

        return errorMessage;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
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
                const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}home/signup_seller`, formData);
                if (response.status === 201) {
                    setFormData({
                        full_name: "",
                        user_name: "",
                        email: "",
                        address: "",
                        phone_number: "",
                        dob: "",
                        profile_photo: "",
                        password: "",
                        confirm_password: ""
                    });
                    msgs.current.show([ { severity: "success", summary: "Success", detail: response.data.message, life: 5000 } ]);
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
                console.error("Error submitting form:", errorMessage);
        
                msgs.current.show([
                    { severity: "error", summary: "Error", detail: errorMessage, life: 8000 },
                ]);
            }
        }  
    };

    return (
        <div className={`${css["main_body"]} d-flex flex-column gap-2 justify-content-center align-items-center`}>
            <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 1000 }}>
                <Messages ref={msgs} />
            </div>
            <form method="POST" className={`${css["signup_user_form"]} border rounded p-2 d-flex flex-column justify-content-evenly`} onSubmit={handleSubmit}>
                <h1 className="text-start">Signup Seller</h1>
                <div className="d-flex flex-column gap-1">
                    <div className={`${css["signup_user_form_field"]} d-flex`}>
                        <div className="d-flex flex-column w-100 px-2">
                            <label htmlFor="full_name">Full Name</label>
                            <div>
                                <InputText id="full_name" name="full_name" placeholder="full name" value={formData.full_name} onChange={handleChange} className={`${errors.full_name ? "p-invalid" : ""} w-100`}/>
                                <div> {errors.full_name && <small className="p-error">{errors.full_name}</small>} </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column w-100 px-2">
                            <label htmlFor="user_name">User Name</label>
                            <div>
                                <InputText id="user_name" name="user_name" placeholder="user name" value={formData.user_name} onChange={handleChange} className={`${errors.user_name ? "p-invalid" : ""} w-100`}/>
                                <div>{errors.user_name && <small className="p-error">{errors.user_name}</small>}</div>
                            </div>
                        </div>
                        <div className="d-flex flex-column w-100 px-2">
                            <label htmlFor="email">Email</label>
                            <div>
                                <InputText id="email" name="email" placeholder="email" type="email" value={formData.email} onChange={handleChange} className={`${errors.email ? "p-invalid" : ""} w-100`}/>
                                <div>{errors.email && <small className="p-error">{errors.email}</small>}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${css["signup_user_form_field_address"]} px-2`}>
                        <label>Address</label>
                        <div>
                            <InputTextarea placeholder="address" name="address" value={formData.address} onChange={handleChange} className={`${css['InputTextarea']} ${errors.address ? "p-invalid" : ""} w-100`} />
                            <div>{errors.address && <small className="p-error">{errors.address}</small>}</div>
                        </div>
                    </div>
                    <div className={`${css["signup_user_form_field"]} d-flex`}>
                        <div className="d-flex flex-column w-100 px-2">
                            <label htmlFor="phone_number">Phone Number</label>
                            <div>
                                <InputText id="phone_number" name="phone_number" placeholder="phone number" value={formData.phone_number} onChange={handleChange} className={`${errors.phone_number ? "p-invalid" : ""} w-100`}/>
                                <div> {errors.phone_number && <small className="p-error">{errors.phone_number}</small>} </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column w-100 px-2">
                            <label htmlFor="dob">Date of Birth</label>
                            <div>
                                <Calendar 
                                    id="dob" 
                                    name="dob" 
                                    placeholder="dob" 
                                    className={`${errors.dob ? "p-invalid" : ""} w-100`}
                                    value={formData.dob}
                                    maxDate={maxDate}
                                    onChange={(e) => {
                                        setFormData((prevData) => ({ ...prevData, dob: e.value }));
                                        setErrors((prevError) => ({ ...prevError, dob: "" }));
                                    }}                                    
                                />
                                <div>{errors.dob && <small className="p-error">{errors.dob}</small>}</div>
                            </div>
                        </div>
                        <div className="d-flex flex-column w-100 px-2">
                            <label htmlFor="profile_photo">Profile Photo</label>
                            <div>
                                <FileUpload
                                    id="profile_photo"
                                    name="profile_photo"
                                    mode="basic"
                                    url={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}home/upload/seller`} 
                                    accept="image/*"
                                    className={`${errors.profile_photo ? "p-invalid" : ""} w-100`}
                                    maxFileSize={2000000}
                                    auto
                                    onUpload={(e) => {
                                        msgs.current.show([ { severity: "success", summary: "Upload Successful:", detail: e.files[0].name, life: 5000 } ]);
                                        setFormData((prevData) => ({ ...prevData, profile_photo: e.files[0].name }));
                                        setErrors((prevError) => ({ ...prevError, profile_photo: "" }));
                                    }}
                                />
                                <div>{errors.profile_photo && <small className="p-error">{errors.profile_photo}</small>}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${css["signup_user_form_field"]} d-flex`}>
                        <div className="d-flex flex-column w-100 px-2">
                            <label htmlFor="password">Password</label>
                            <div>
                                <InputText id="password" name="password" placeholder="password" type="password" value={formData.password} onChange={handleChange} className={`${errors.password ? "p-invalid" : ""} w-100`}/>
                                <div> {errors.password && <small className="p-error">{errors.password}</small>} </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column w-100 px-2">
                            <label htmlFor="confirm_password">Conform Password</label>
                            <div>
                                <InputText id="confirm_password" name="confirm_password" placeholder="conform password" value={formData.confirm_password} onChange={handleChange} className={`${errors.confirm_password ? "p-invalid" : ""} w-100`}/>
                                <div>{errors.confirm_password && <small className="p-error">{errors.confirm_password}</small>}</div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className={`btn btn-primary w-100`}>Submit</button>
                </div>
            </form>
            <div className={`${css["signup_link"]} border rounded p-2 d-flex flex-column`}>
                <span>Have an account? <Link to="/login" className="text-primary">Login</Link></span>
                <span>Want to join as a User? <Link to="/signup_user" className="text-primary">Sign up here</Link></span>
            </div>
        </div>
    )
}