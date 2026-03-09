export default function useApiUrl() {
    return {
        apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://edutrack-backend-7z7q.onrender.com/api",
        loadingUrl: false
    };
}
