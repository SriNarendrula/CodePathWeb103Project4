const OPTION_PRICES = {
    colors: {
        'Matte Black': 1500,
        'Midnight Blue': 800,
        'Standard White': 0
    },
    trim: {
        'Base': 25000,
        'Sport': 31000,
        'Premium Luxe': 42000
    }
};

export const calculateTotalPrice = (trim, color) => {
    const basePrice = OPTION_PRICES.trim[trim] || 25000;
    const colorPremium = OPTION_PRICES.colors[color] || 0;
    
    return basePrice + colorPremium;
};