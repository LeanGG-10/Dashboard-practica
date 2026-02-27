const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchGlobalQuote = async (ticker) => {
    const response = await fetch(
        `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`
    );
    return await response.json(); // Devuelve el JSON tal cual
};