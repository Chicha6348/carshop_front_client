import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FilterCard from "./FilterCard";
import Footer from "./Footer";
import "./MainPage.css";
import axios from "axios";
import "./CarsGallery.css"

const MainPage = () => {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    var counter = 0;
    const getFilteredGoods = async (filters) => {
        try {
            const response = await axios.get("http://localhost:8080/api/goods", { params: filters });
            return response.data;
        } catch (error) {
            console.error("Error fetching goods:", error);
            throw error;
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getFilteredGoods();
                setCars(data);
                console.log("Fetched Cars:", data); // Debugging
            } catch (error) {
                console.error("Error in useEffect fetch:", error);
            }
        };

        fetchData();
        return () => {
            console.log("Cleanup effect ran");
        };
    }, []);

    const handleFilterSubmit = async (filters) => {
        try {
            const data = await getFilteredGoods(filters);
            setCars(data);

            navigate("/cars", { state: { filteredCars: data } });
        } catch (error) {
            console.error("Error fetching cars:", error);
        }
    };

    const handleBuy = (carId) => {
        console.log(`Buy button clicked for car with ID: ${carId}`);
        navigate(`/buy/${carId}`);
    };

    const handleDetails = (carId) => {
        console.log(`Details button clicked for car with ID: ${carId}`);
        navigate(`/car-details/${carId}`);
    };

    return (
        <div className="main-page">
            <div className="main-content">
                <div className="filter-section">
                    <FilterCard onApplyFilters={handleFilterSubmit} />
                    <div className="cars-gallery" style={{marginTop: "50px", marginBottom: "150px"}}>
                        <div className="cars-gallery">
                            {cars? cars.map((car) => {
                                if(counter < 5){
                                    console.log(car);
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
                                }
                                counter++;
                            }):{}}
                        </div>
                        <div className="main-cards2">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
