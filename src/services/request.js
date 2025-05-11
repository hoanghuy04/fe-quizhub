const API_DOMAIN = import.meta.env.VITE_API_URL;

export const get = async (path) => {
    console.log(`${API_DOMAIN}${path}`);
    
    try {
        const response = await fetch(`${API_DOMAIN}${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${API_DOMAIN}${path}:`, error);
        throw error;
    }
}