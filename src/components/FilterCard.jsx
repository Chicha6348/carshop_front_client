import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FiltersCard.css";

const FilterCard = ({ onApplyFilters }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filters, setFilters] = useState({
        bodyTypeId: "",
        modelName: "",
        priceMax: "",
        priceMin: "",
        manufacturerId: "",
        colorId: "",
        countryId: "",
        availabilityId: "",
        modelYear: "",
        engineVolumeMin: "",
        engineVolumeMax: "",
        engineName: "",
        enginePlacementId: "",
        doorsCount: "",
        placesCount: ""
    });

    const [options, setOptions] = useState({
        bodyTypes: [],
        manufacturers: [],
        colors: [],
        countries: [],
        availabilities: [],
        enginePlacements: [],
        engines: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bodytypesRes, manufacturersRes, colorsRes, countriesRes, availabilitiesRes, enginePlacementsRes, enginesRes] = await Promise.all([
                    axios.get("http://localhost:8081/api/bodytypes").catch((err) => { console.log("Status: " + err.status + " " + err.data) }),
                    axios.get("http://localhost:8081/api/manufacturers").catch((err) => { console.log("Status: " + err.status + " " + err.data) }),
                    axios.get("http://localhost:8081/api/colors").catch((err) => { console.log("Status: " + err.status + " " + err.data) }),
                    axios.get("http://localhost:8081/api/countries").catch((err) => { console.log("Status: " + err.status + " " + err.data) }),
                    axios.get("http://localhost:8081/api/availabilities").catch((err) => { console.log("Status: " + err.status + " " + err.data) }),
                    axios.get("http://localhost:8081/api/engineplacements").catch((err) => { console.log("Status: " + err.status + " " + err.data) }),
                    axios.get("http://localhost:8081/api/engines").catch((err) => { console.log("Status: " + err.status + " " + err.data) }),
                ]);

                setOptions({
                    bodyTypes: bodytypesRes.data,
                    manufacturers: manufacturersRes.data,
                    colors: colorsRes.data,
                    countries: countriesRes.data,
                    availabilities: availabilitiesRes.data,
                    enginePlacements: enginePlacementsRes.data,
                    engines: enginesRes.data
                });
            } catch (error) {
                console.error("Fetch failed:", error);
            }
        };
        fetchData();
    }, []);

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        try {
            const filteredFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
            );
            console.log("Applying filters:", filteredFilters);
            onApplyFilters(filteredFilters);
        } catch (error) {
            console.error("Error applying filters:", error);
        }
    };


    return (
        <div className="filters-card">
            <h2>Filters</h2>
            <div className="filters-horizontal">
                <div className="filters-basic">
                    <div className="filter-group">
                        <label>Model</label>
                        <input
                            type="text"
                            name="modelName"
                            value={filters.modelName}
                            onChange={handleInputChange}
                            placeholder="Enter model"
                        />
                    </div>
                    <div className="filter-group">
                        <label>Manufacturer</label>
                        <select name="manufacturerId" value={filters.manufacturerId} onChange={handleInputChange}>
                            <option value="">Select</option>
                            {options.manufacturers.map((manufacturer) => (
                                <option key={manufacturer.id} value={manufacturer.id}>
                                    {manufacturer.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="filters-basic">
                    <div className="filter-group">
                        <label>Body Type</label>
                        <select name="bodyTypeId" value={filters.bodyTypeId} onChange={handleInputChange}>
                            <option value="">Select</option>
                            {options.bodyTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Availability</label>
                        <select name="availabilityId" value={filters.availabilityId} onChange={handleInputChange}>
                            <option value="">Choose</option>
                            {options.availabilities.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="filter-group">
                <label>Price</label>
                <div style={{ display: "flex" }}>
                    <input
                        type="number"
                        name="priceMin"
                        value={filters.priceMin}
                        onChange={handleInputChange}
                        placeholder="From"
                    />
                    <p style={{ paddingLeft: 10, paddingRight: 10 }}> - </p>
                    <input
                        type="number"
                        name="priceMax"
                        value={filters.priceMax}
                        onChange={handleInputChange}
                        placeholder="To"
                    />
                </div>
            </div>

            <button className="filters-expand-button" onClick={toggleExpanded}>
                {isExpanded ? "Hide Advanced" : "Advanced"}
            </button>
            {isExpanded && (
                <div>
                    <div className="filters-horizontal">
                        <div className="filters-advanced">
                            <div className="filter-group">
                                <label>Color</label>
                                <select name="colorId" value={filters.colorId} onChange={handleInputChange}>
                                    <option value="">Choose</option>
                                    {options.colors.map((color) => (
                                        <option key={color.id} value={color.id}>
                                            {color.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Engine</label>
                                <select name="engineName" value={filters.engineName} onChange={handleInputChange}>
                                    <option value="">Choose</option>
                                    {options.engines.map((item) => (
                                        <option key={item.id} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Places Count</label>
                                <input
                                    type="text"
                                    name="placesCount"
                                    value={filters.placesCount}
                                    onChange={handleInputChange}
                                    placeholder="Enter places count"
                                />
                            </div>
                        </div>

                        <div className="filters-advanced">
                            <div className="filter-group">
                                <label>Country</label>
                                <select name="countryId" value={filters.countryId} onChange={handleInputChange}>
                                    <option value="">Choose</option>
                                    {options.countries.map((color) => (
                                        <option key={color.id} value={color.id}>
                                            {color.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Engine Placement</label>
                                <select name="enginePlacementId" value={filters.enginePlacementId} onChange={handleInputChange}>
                                    <option value="">Choose</option>
                                    {options.enginePlacements.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Doors Count</label>
                                <input
                                    type="text"
                                    name="doorsCount"
                                    value={filters.doorsCount}
                                    onChange={handleInputChange}
                                    placeholder="Enter doors count"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Engine Volume</label>
                        <div style={{ display: "flex" }}>
                            <input
                                type="number"
                                name="engineVolumeMin"
                                value={filters.engineVolumeMin}
                                onChange={handleInputChange}
                                placeholder="From"
                            />
                            <p style={{ paddingLeft: 10, paddingRight: 10 }}> - </p>
                            <input
                                type="number"
                                name="engineVolumeMax"
                                value={filters.engineVolumeMax}
                                onChange={handleInputChange}
                                placeholder="To"
                            />
                        </div>
                    </div>
                </div>
            )}

            <button className="apply-filters-button" onClick={handleApplyFilters}>
                Apply Filters
            </button>
        </div>
    );
};

export default FilterCard;
