import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCarById } from '../services/CarsAPI';

const CarDetails = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);

    useEffect(() => {
        getCarById(id)
            .then(data => setCar(data))
            .catch(err => console.error(err));
    }, [id]);

    if (!car) return <p>Loading car specifications...</p>;

    return (
        <div className="details-container">
            <h2>{car.year} {car.make} {car.model}</h2>
            <hr />
            <p><strong>Exterior Finish:</strong> {car.color}</p>
            <p><strong>Base Trim:</strong> {car.trim}</p>
            <p><strong>Roof Line:</strong> {car.roofType}</p>
            <p><strong>Total Price:</strong> ${car.price?.toLocaleString() || '35,000'}</p>
            
            {/* Action Button Links wrapper */}
            <div style={{ marginTop: '2rem' }}>
                <Link to={`/edit/${car.id}`} className="btn-secondary">Modify Build</Link>
                <Link to="/" className="back-link">Back to Fleet</Link>
            </div>
        </div>
    );
};

export default CarDetails;