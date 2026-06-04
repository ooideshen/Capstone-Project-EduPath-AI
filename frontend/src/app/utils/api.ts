const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://edupath-ai-backend-blio.onrender.com';
export const API_URL = rawApiUrl.replace(/\/+$/, '');
