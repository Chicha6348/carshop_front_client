import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CarsGallery.css";

const CarsGallery = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const cars = location.state?.filteredCars || [];

    useEffect(() => {
        if (!location.state?.filteredCars) {
            navigate("/");
        }
        console.log(location.state?.filteredCars);
    }, [location.state, navigate]);

    const handleBuy = (carId) => {
        console.log(`Buy button clicked for car with ID: ${carId}`);
        navigate(`/buy/${carId}`);
    };

    const handleDetails = (carId) => {
        console.log(`Details button clicked for car with ID: ${carId}`);
        navigate(`/car-details/${carId}`);
    };

    if (cars.length === 0) {
        return (
            <div className="not-found">
                <h1>No Cars Found</h1>
                <p>We couldn't find any cars matching your criteria. Please try again.</p>
                <a href="/">Go Back to Homepage</a>
            </div>
        );
    }
    return (
        <div className="cars-gallery">
            {cars.map((car) => {
                console.log(car); // Debugging
                return (
                    <div className="car-card" key={car.id}>
                        <div className="car-image">
                            <img
                                src={`http://localhost:8081/img/${car.id}.jpg`}
                                alt={typeof car.model?.modelName?.name === "string" ? car.model.modelName.name : "Car Image"}
                                style={{ width: "100%", height: "150px", objectFit: "cover" }}
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/150";
                                }}
                            />
                        </div>
                        <h3 className="car-title">{car.model?.modelName?.name || "Unknown Model"}</h3>
                        <p><strong>Manufacturer:</strong> {car.model?.modelName?.manufacturer?.name || "Unknown Manufacturer"}</p>
                        <p><strong>Year:</strong> {car.model?.year || "Unknown Year"}</p>
                        <p><strong>Body Type:</strong> {car.model?.characteristics?.bodyType?.name || "Unknown Body Type"}</p>
                        <p><strong>Doors:</strong> {car.model?.characteristics?.doorsCount || "Unknown"}</p>
                        <p><strong>Seats:</strong> {car.model?.characteristics?.placesCount || "Unknown"}</p>
                        <p>
                            <strong>Engine:</strong> {car.model?.characteristics?.engine?.name || "Unknown"}
                            ({car.model?.characteristics?.engine?.volume || "N/A"}L)
                        </p>
                        <p><strong>Color:</strong> {car.color?.name || "Unknown"}</p>
                        <p><strong>Price:</strong> ${car.price?.toLocaleString() || "Not Available"}</p>
                        <div className="button-container">
                            <button
                                className="buy-button1"
                                onClick={() => handleBuy(car.id)}
                                style={car?.availability.type == "Sold"?{display:"none"}:{}}
                            >
                                Buy
                            </button>
                            <button
                                className="details-button"
                                onClick={() => handleDetails(car.id)}
                            >
                                Details
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );

};

export default CarsGallery;
