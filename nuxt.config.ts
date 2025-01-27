// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      // Use the correct backend URL based on environment (development or production)
      apiBaseURL: process.env.NODE_ENV === 'production'
        ? 'https://your-deployed-backend-url.com/api/customers'  // Replace with your deployed backend URL
        : 'http://localhost:3000/api/customers', // For local development
    },
  },
});
