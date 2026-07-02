import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCarById, updateCar } from '../services/CarsAPI'
import { calculateTotalPrice } from '../utilities/calcPrice'
import { checkFeatureCombinations } from '../utilities/validateFeatures'
import '../App.css'

const EditCar = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    
    const [carData, setCarData] = useState({
        make: '',
        model: '',
        year: '',
        color: 'Standard White',
        trim: 'Base',
        roofType: 'Hardtop'
    })
    const [price, setPrice] = useState(25000)
    const [loading, setLoading] = useState(true)

    // Pull the specific configuration settings out of the DB when page mounts
    // Inside client/src/pages/EditCar.jsx -> find your useEffect and update it to this:
useEffect(() => {
    getCarById(id)
        .then(data => {
            // 🛠️ Ensure no database value is null by injecting default strings as fallbacks
            setCarData({
                make: data.make || '',
                model: data.model || '',
                year: data.year || '',
                color: data.color || 'Standard White',
                trim: data.trim || 'Base',
                roofType: data.roofType || 'Hardtop'
            })
            const initialPrice = calculateTotalPrice(data.trim || 'Base', data.color || 'Standard White')
            setPrice(initialPrice)
            setLoading(false)
        })
        .catch(err => console.error(err))
}, [id])

    const handleChange = (e) => {
        setCarData({ ...carData, [e.target.name]: e.target.value })
    }

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
            await updateCar(id, payload)
            navigate('/') // Redirect back to dashboard panel
        } catch (err) {
            alert("Error updating your configuration.")
        }
    }

    if (loading) return <p>Loading car specifications from server...</p>

    return (
        <div className="form-container">
            {title && <small className="page-title-tag">{title}</small>}
            <h2>Modify Your Build Specification</h2>
            <h3>Updated MSRP: ${price.toLocaleString()}</h3>
            
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

                <button type="submit">Save Upgrades</button>
            </form>
        </div>
    )
}

export default EditCar