import dotenv from "dotenv";
dotenv.config();

import { betterAuth } from "better-auth";

export const auth = betterAuth({

  secret: process.env.BETTER_AUTH_SECRET,

baseURL: "https://your-render-backend-url.onrender.com",

trustedOrigins: [
  "https://doctor-appointment-client-n1e60gj1w-nusrats-projects-299df817.vercel.app",
],

  socialProviders: {

    google: {

      clientId: process.env.GOOGLE_CLIENT_ID,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

    },

  },

});