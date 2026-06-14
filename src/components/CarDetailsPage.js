import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CarDetailsPage.css";

const CarDetailsPage = () => {
    const { id } = useParams(); // Get car ID from URL
    const [carDetails, setCarDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/good:${id}`);
                setCarDetails(response.data);
                setLoading(false);
            } catch (e) {
                setError("Failed to load car details.");
                setLoading(false);
            }
        };
        fetchCarDetails();
    }, [id]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="car-details-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                Back
            </button>
            {carDetails && (
                <div className="car-details-box">
                    <div className="car-image">
                        <img
                            src={`http://localhost:8081/img/${carDetails.id}.jpg`}
                            alt={carDetails.model.modelName.name}
                            style={{ width: "100%", height: "300px", objectFit: "cover" }}
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/300";
                            }}
                        />
                    </div>
                    <h2>
                        {carDetails.model.modelName.manufacturer.name}{" "}
                        {carDetails.model.modelName.name} ({carDetails.model.year})
                    </h2>
                    <div className="car-specs">
                        <p>
                            <strong>Color:</strong> {carDetails.color.name}
                        </p>
                        <p>
                            <strong>Body Type:</strong>{" "}
                            {carDetails.model.characteristics.bodyType.name}
                        </p>
                        <p>
                            <strong>Engine:</strong>{" "}
                            {carDetails.model.characteristics.engine.name} -{" "}
                            {carDetails.model.characteristics.engine.volume}L
                        </p>
                        <p>
                            <strong>Doors:</strong> {carDetails.model.characteristics.doorsCount}
                        </p>
                        <p>
                            <strong>Seats:</strong> {carDetails.model.characteristics.placesCount}
                        </p>
                        <p>
                            <strong>Price:</strong> ${carDetails.price.toFixed(2)}
                        </p>
                        <p>
                            <strong>Availability:</strong> {carDetails.availability.type}
                        </p>
                    </div>

                    <button
                        className="buy-button"
                        onClick={() => navigate(`/buy/${id}`)}
                        style={carDetails.availability.type == "Sold"?{display:"none"}:{}}
                    >
                        Buy Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default CarDetailsPage;
