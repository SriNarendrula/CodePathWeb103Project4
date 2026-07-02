import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCar } from '../services/CarsAPI'
import { calculateTotalPrice } from '../utilities/calcPrice'
import { checkFeatureCombinations } from '../utilities/validateFeatures'
import '../App.css'

const CreateCar = ({ title }) => {
    const navigate = useNavigate()
    
    // Initialize state with default configuration values
    const [carData, setCarData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        color: 'Standard White',
        trim: 'Base',
        roofType: 'Hardtop'
    })
    
    const [price, setPrice] = useState(25000)

    // Handler for regular input modifications (make, model, year)
    const handleChange = (e) => {
        setCarData({ ...carData, [e.target.name]: e.target.value })
    }

    // Handler for dropdown selections that updates calculations & checks compatibilities
    const handleFeatureChange = (e) => {
        const { name, value } = e.target
        const pendingData = { ...carData, [name]: value }
        
        const validation = checkFeatureCombinations({ 
            trim: pendingData.trim, 
            roofType: pendingData.roofType 
        })
        
        if (!validation.isValid) {
             alert(validation.reason)
             return
        }
        
        const updatedPrice = calculateTotalPrice(pendingData.trim, pendingData.color)
        setPrice(updatedPrice)
        setCarData(pendingData)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = { ...carData, price }
            await createCar(payload)
            navigate('/') // Send back to dashboard on success
        } catch (err) {
            alert("Error creating your custom car configuration.")
        }
    }

    return (
        <div className="form-container">
            {title && <small className="page-title-tag">{title}</small>}
            <h2>Design Your Custom Build</h2>
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
                
                <label>Trim Line
                    <select name="trim" value={carData.trim} onChange={handleFeatureChange}>
                        <option value="Base">Base</option>
                        <option value="Sport">Sport</option>
                        <option value="Track Edition">Track Edition</option>
                        <option value="Premium Luxe">Premium Luxe</option>
                    </select>
                </label>

                <label>Roof Style
                    <select name="roofType" value={carData.roofType} onChange={handleFeatureChange}>
                        <option value="Hardtop">Hardtop</option>
                        <option value="Convertible">Convertible</option>
                    </select>
                </label>

                <label>Color Option
                    <select name="color" value={carData.color} onChange={handleFeatureChange}>
                        <option value="Standard White">Standard White</option>
                        <option value="Midnight Blue">Midnight Blue</option>
                        <option value="Matte Black">Matte Black</option>
                    </select>
                </label>

                <button type="submit">Submit Build</button>
            </form>
        </div>
    )
}

export default CreateCar