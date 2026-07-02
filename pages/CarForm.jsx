import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createCar, getCarById, updateCar } from '../services/CarsAPI';
import { calculateTotalPrice } from '../utilities/calcPrice';
import { checkFeatureCombinations } from '../utilities/validateFeatures';

const CarForm = () => {
    const { id } = useParams(); 
    const isEditMode = !!id;

    const [carData, setCarData] = useState({
        make: '',
        model: '',
        year: '',
        color: 'Standard White',
        trim: 'Base',
        roofType: 'Hardtop'
    });
    
    const [price, setPrice] = useState(25000);

    useEffect(() => {
        if (isEditMode) {
            getCarById(id)
                .then(data => {
                    setCarData(data);
                    const initialPrice = calculateTotalPrice(data.trim || 'Base', data.color || 'Standard White');
                    setPrice(initialPrice);
                })
                .catch(err => console.error(err));
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setCarData({ ...carData, [e.target.name]: e.target.value });
    };

    const handleFeatureChange = (e) => {
        const { name, value } = e.target;
        
        const pendingData = { ...carData, [name]: value };
        
        const validation = checkFeatureCombinations({ 
            trim: pendingData.trim, 
            roofType: pendingData.roofType 
        });
        
        if (!validation.isValid) {
             alert(validation.reason); 
             return;
        }
        
        const updatedPrice = calculateTotalPrice(pendingData.trim, pendingData.color);
        setPrice(updatedPrice);
        setCarData(pendingData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...carData, price }; 
            
            if (isEditMode) {
                await updateCar(id, payload);
            } else {
                await createCar(payload);
            }
            navigate('/'); // Bounce user back to dashboard on success
        } catch (err) {
            alert("Error saving configuration.");
        }
    };

    return (
        <div className="form-container">
            <h2>{isEditMode ? 'Modify Your Configuration' : 'Design Your Car'}</h2>
            <h3>Estimated MSRP: ${price.toLocaleString()}</h3>
            
            <form onSubmit={handleSubmit}>
                <label>Make
                    <input name="make" value={carData.make} onChange={handleChange} required />
                </label>
                <label>Model
                    <input name="model" value={carData.model} onChange={handleChange} required />
                </label>
                <label>Year
                    <input type="number" name="year" value={carData.year} onChange={handleChange} required />
                </label>
                
                {/* Trim Dropdown */}
                <label>Trim Line
                    <select name="trim" value={carData.trim} onChange={handleFeatureChange}>
                        <option value="Base">Base</option>
                        <option value="Sport">Sport</option>
                        <option value="Track Edition">Track Edition</option>
                        <option value="Premium Luxe">Premium Luxe</option>
                    </select>
                </label>

                {/* Roof Type Dropdown */}
                <label>Roof Style
                    <select name="roofType" value={carData.roofType} onChange={handleFeatureChange}>
                        <option value="Hardtop">Hardtop</option>
                        <option value="Convertible">Convertible</option>
                    </select>
                </label>

                {/* Color Dropdown */}
                <label>Color Option
                    <select name="color" value={carData.color} onChange={handleFeatureChange}>
                        <option value="Standard White">Standard White</option>
                        <option value="Midnight Blue">Midnight Blue</option>
                        <option value="Matte Black">Matte Black</option>
                    </select>
                </label>

                <button type="submit">{isEditMode ? 'Save Upgrades' : 'Submit Build'}</button>
            </form>
        </div>
    );
};

export default CarForm;