import dotenv from "dotenv";

dotenv.config();

import { betterAuth } from "better-auth";

import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { toNodeHandler } from "better-auth/node";

import client from "../config/db.js";

const auth =
  betterAuth({

    secret:
      process.env.BETTER_AUTH_SECRET,

    baseURL:
      "https://doctor-appointment-server-seven.vercel.app/api/auth",

    trustedOrigins: [

      "https://doctor-appointment-client-psi.vercel.app",

      "http://localhost:5173",

    ],

    session: {

      cookieCache: {
        enabled: true,
      },

    },

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

export const authHandler =
  toNodeHandler(auth);

export { auth };