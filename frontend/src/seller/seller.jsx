import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Seller() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || user?.role !== "seller") {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div>
            seller
        </div>
    );
}