const configuredApiUrl = import.meta.env.VITE_API_URL || '/api';

export const API_URL = configuredApiUrl.replace(/\/+$/, '');
