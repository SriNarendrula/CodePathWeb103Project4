const BASE_URL = '/api/cars';

export const getAllCars = async () => {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch all cars');
        return await response.json();
    } catch (error) {
        console.error("Error in getAllCars:", error);
        throw error;
    }
};

export const getCarById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch car with ID ${id}`);
        return await response.json();
    } catch (error) {
        console.error(`Error in getCarById (${id}):`, error);
        throw error;
    }
};

export const createCar = async (carData) => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carData),
        });
        if (!response.ok) throw new Error('Failed to create new car');
        return await response.json();
    } catch (error) {
        console.error("Error in createCar:", error);
        throw error;
    }
};

export const updateCar = async (id, carData) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carData),
        });
        if (!response.ok) throw new Error(`Failed to update car with ID ${id}`);
        return await response.json();
    } catch (error) {
        console.error(`Error in updateCar (${id}):`, error);
        throw error;
    }
};

export const deleteCar = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Failed to delete car with ID ${id}`);
        return await response.json();
    } catch (error) {
        console.error(`Error in deleteCar (${id}):`, error);
        throw error;
    }
};