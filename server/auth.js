import dotenv from "dotenv";

dotenv.config();

import { betterAuth } from "better-auth";

import { mongodbAdapter } from "better-auth/adapters/mongodb";

import client from "../config/db.js";

export const auth = betterAuth({

  secret:
    process.env.BETTER_AUTH_SECRET,

  baseURL:
    process.env.BETTER_AUTH_URL,

  trustedOrigins: [

    "https://doctor-appointment-client-psi.vercel.app",

    "http://localhost:5173",

  ],

  database:
    mongodbAdapter(
      client.db("docappoint")
    ),

  socialProviders: {

    google: {

      clientId:
        process.env.GOOGLE_CLIENT_ID,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,

    },

  },

});