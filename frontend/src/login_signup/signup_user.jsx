import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Messages } from "primereact/messages";
import { useRef } from "react";

import axios from "axios";
import css from "./login_signup.module.css";

export default function Signup_User() {
    const msgs = useRef(null);

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
      full_name: "",
      email: "",
      password: "",
      phone_number: "",
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
    });

    const validateField = (name, value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        let errorMessage = "";
        if (!value.trim()) {
          errorMessage = "This field is required.";
        } else if (name === "email" && !emailRegex.test(value)) {
          errorMessage = "Invalid email format.";
        } else if (name === "phone_number" && !phoneRegex.test(value)) {
          errorMessage = "Invalid phone number.";
        }
        return errorMessage;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["street", "city", "state", "zip"].includes(name)) {
          setFormData({
            ...formData,
            address: { ...formData.address, [name]: value },
          });
        } else {
          setFormData({ ...formData, [name]: value });
        }
    
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: validateField(name, value),
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formErrors = {};
        for (const field in formData) {
            if (field === "address") {
                for (const subField in formData.address) {
                    formErrors[subField] = validateField(subField, formData.address[subField]);
                }
            } else {
                formErrors[field] = validateField(field, formData[field]);
            }
        }
        setErrors(formErrors);
        
        if (Object.values(formErrors).every((error) => !error)) {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_REACT_APP_BACKEND_URL}home/signup_user`,
                    formData
                );
                
                if (response.status === 201) {
    
                    setFormData({
                        full_name: "",
                        email: "",
                        password: "",
                        phone_number: "",
                        address: { street: "", city: "", state: "", zip: "" },
                    });
        
                    msgs.current.show([
                        { severity: "success", summary: "Success", detail: response.data.message, life: 5000 },
                    ]);
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
        <div className={`${css["main_body"]} flex-column gap-2 d-flex justify-content-center align-items-center`}>
            <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 1000 }}>
                <Messages ref={msgs} />
            </div>
            <form method="POST" className={`${css["signup_user_form"]} border rounded d-flex flex-column justify-content-between gap-3 p-2 py-4`} onSubmit={handleSubmit}>
                <h1 className="text-center">Signup User</h1>
                <div>
                    <div className={`${css["signup_user_form_field"]} d-flex justify-content-evenly`}>
                        <div className="d-flex flex-column ">
                            <label htmlFor="full_name">Full Name</label>
                            <div>
                                <InputText id="full_name" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} className={errors.full_name ? "p-invalid" : ""}/>
                                <div> {errors.full_name && <small className="p-error">{errors.full_name}</small>} </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            <label htmlFor="email">Email</label>
                            <div>
                                <InputText id="email" name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} className={errors.email ? "p-invalid" : ""}/>
                                <div>{errors.email && <small className="p-error">{errors.email}</small>}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${css["signup_user_form_field_address"]} d-flex justify-content-evenly flex-column`}>
                        <label className="ps-2">Address</label>
                        <div className="h-100 d-flex flex-column justify-content-evenly">
                            <div className="d-flex justify-content-evenly h-100">
                                <div className="flex flex-column gap-2">
                                    <InputText name="street" placeholder="Street" value={formData.address.street} onChange={handleChange} className={errors.street ? "p-invalid" : ""}/>
                                    <div>{errors.street && <small className="p-error">{errors.street}</small>}</div>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <InputText name="city" placeholder="City" value={formData.address.city} onChange={handleChange} className={errors.city ? "p-invalid" : ""}/>
                                    <div>{errors.city && <small className="p-error">{errors.city}</small>}</div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-evenly h-100">
                                <div className="flex flex-column gap-2">
                                    <InputText name="state" placeholder="State" value={formData.address.state} onChange={handleChange} className={errors.state ? "p-invalid" : ""}/>
                                    <div>{errors.state && <small className="p-error">{errors.state}</small>}</div>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <InputText name="zip" placeholder="Zip" value={formData.address.zip} onChange={handleChange} className={errors.zip ? "p-invalid" : ""}/>
                                    <div>{errors.zip && <small className="p-error">{errors.zip}</small>}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${css["signup_user_form_field"]} d-flex justify-content-evenly`}>
                        <div className="d-flex flex-column">
                            <label htmlFor="password">Password</label>
                            <div>
                                <InputText id="password" name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} className={errors.password ? "p-invalid" : ""}/>
                                <div>{errors.password && <small className="p-error">{errors.password}</small>}</div>
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            <label htmlFor="phone_number">Phone Number</label>
                            <div>
                                <InputText id="phone_number" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} className={errors.phone_number ? "p-invalid" : ""}/>
                                <div>{errors.phone_number && <small className="p-error">{errors.phone_number}</small>}</div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className={`btn btn-primary w-100`}>Submit</button>
                </div>
                <div></div>
            </form>
            <div className={`${css["signup_link"]} card p-2 py-4 text-center`}>
                <span>Have an account? <Link to="/login" className="text-primary">Login</Link></span>
                <span>Looking to sell your products? <Link to="/signup_seller" className="text-primary">Register as a Seller</Link></span>
            </div>
        </div>
    )
}