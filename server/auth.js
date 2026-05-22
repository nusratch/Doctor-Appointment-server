import dotenv from "dotenv";
dotenv.config();

import { betterAuth } from "better-auth";

export const auth = betterAuth({

  secret: process.env.BETTER_AUTH_SECRET,

baseURL: "https://doctor-appointment-server-seven.vercel.app",

trustedOrigins: [
  "https://doctor-appointment-client-psi.vercel.app",
],

  socialProviders: {

    
    google: {

      clientId: process.env.GOOGLE_CLIENT_ID,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

    },

  },

});