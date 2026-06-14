import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfilePage.css";
import { FaEdit, FaSave } from "react-icons/fa";
import moment from "moment";

const ProfilePage = (isAuthenticated) => {
    const [userInfo, setUserInfo] = useState(null);
    const [editMode, setEditMode] = useState({});
    const [passwordChange, setPasswordChange] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [userDeals, setUserDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                if(!isAuthenticated) {
                    navigate("/login");
                }
                const token = localStorage.getItem("token");
                const userRes = await axios.get("http://localhost:8080/api/authed/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const dealsRes = await axios.get("http://localhost:8080/api/authed/deals", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserInfo(userRes.data);
                setUserDeals(dealsRes.data);
                setEditMode({});
                setLoading(false);
            } catch (e) {
                console.error("Failed to fetch profile data:", e);
                setError("Failed to load profile data. Please try again later.");
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [navigate]);

    const handleEditToggle = (field) => {
        setEditMode((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSave = async (field) => {
        try {
            const token = localStorage.getItem("token");
            const updatedInfo = { [field]: userInfo[field] };
            updatedInfo.id = userInfo.id;
            await axios.put("http://localhost:8080/api/authed/client", updatedInfo, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Profile updated successfully.");
            handleEditToggle(field);
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    const handlePasswordChange = async () => {
        try {
            const token = localStorage.getItem("token");
            const passwordData = {"newPassword": newPassword,"oldPassword": oldPassword };

            await axios.put("http://localhost:8080/api/authed/client/password", passwordData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Password updated successfully.");
            setPasswordChange(false);
            setOldPassword("");
            setNewPassword("");
        } catch (error) {
            console.error("Failed to change password:", error);
            alert("Failed to change password. Please try again.");
        }
    };
    const handleCancelDeal = async (dealId) => {
        const token = localStorage.getItem("token");
        const confirmCancel = window.confirm("Are you sure you want to cancel this deal?");
        if (confirmCancel) {
            try {
                await axios.post(`http://localhost:8080/api/authed/cancel:${dealId}`, {},{headers: { Authorization: `Bearer ${token}` }});
                window.location.reload();
                alert("Deal canceled successfully.");
            } catch (error) {
                console.error("Error canceling deal:", error);
                alert("Failed to cancel the deal.");
            }
        }
    };


    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-box">
                <h2>Profile Information</h2>
                {userInfo && (
                    <>
                        {["fullName", "email", "phone", "adress", "passportNumber", "passportSeries"].map((field) => (
                            <div className="editable-field" key={field}>
                                <label>
                                    <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                                </label>
                                <input
                                    type="text"
                                    value={userInfo[field]}
                                    disabled={!editMode[field]}
                                    onChange={(e) =>
                                        setUserInfo((prev) => ({
                                            ...prev,
                                            [field]: e.target.value,
                                        }))
                                    }
                                />
                                <button
                                    onClick={() =>
                                        editMode[field] ? handleSave(field) : handleEditToggle(field)
                                    }
                                    className="edit-button"
                                >
                                    {editMode[field] ? <FaSave /> : <FaEdit />}
                                </button>
                            </div>
                        ))}

                        <div className="password-change">
                            <button
                                onClick={() => setPasswordChange((prev) => !prev)}
                                className="change-password-button"
                            >
                                {passwordChange ? "Cancel Password Change" : "Change Password"}
                            </button>
                            {passwordChange && (
                                <div className="password-fields">
                                    <label>
                                        <strong>Old Password:</strong>
                                    </label>
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                    <label>
                                        <strong>New Password:</strong>
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button onClick={handlePasswordChange} className="save-button">
                                        Save Password
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className="deals-box">
                <h2>Your Deals</h2>
                {userDeals.length > 0 ? (
                    <div className="deals-list">
                        {userDeals.map((deal) => (
                            <div className="deal-item" key={deal.id}>
                                <div className="deal-car-info">
                                    <strong>
                                        {deal.good.model.modelName.manufacturer.name}{" "}
                                        {deal.good.model.modelName.name} (
                                        {deal.good.model.year})
                                    </strong>
                                    <p>Color: {deal.good.color.name}</p>
                                    <p>Price: ${deal.finalPrice.toFixed(2)}</p>
                                    <p>Status: {deal.status.name}</p>
                                    <p>Your employee: {deal.employee ? deal.employee.fullName : "Not assigned"}</p>
                                    <strong>{moment(deal.date).format("MMMM Do YYYY, h:mm:ss a")}</strong>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <button
                                        className="details-button"
                                        onClick={() => navigate(`/car-details/${deal.good.id}`)}
                                    >

                                        View Details
                                    </button>
                                    {deal.status.id !== 3 && deal.status.id !== 4 ? (
                                        <button
                                            className="cancel-button"
                                            onClick={() => handleCancelDeal(deal.id)}
                                        >

                                            Cancel
                                        </button>
                                    ):(<>
                                    </>)}

                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No deals found.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
