import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCars, deleteCar } from '../services/CarsAPI';

const ViewCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllCars()
            .then(data => {
                setCars(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this car?")) {
            try {
                await deleteCar(id);
                setCars(cars.filter(car => car.id !== id));
            } catch (err) {
                alert("Failed to delete car.");
            }
        }
    };

    if (loading) return <p>Loading custom cars...</p>;

    return (
        <div className="view-cars-container">
            <h2>Custom Creations</h2>
            <Link to="/create" className="btn-primary">Build New Car</Link>
            <div className="cars-grid">
                {cars.length === 0 ? <p>No cars built yet!</p> : cars.map(car => (
                    <div key={car.id} className="car-card">
                        <h3>{car.year} {car.make} {car.model}</h3>
                        <p>Color: {car.color}</p>
                        <div className="card-actions">
                            <Link to={`/cars/${car.id}`}>View Details</Link>
                            <Link to={`/edit/${car.id}`}>Edit</Link>
                            <button onClick={() => handleDelete(car.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewCars;