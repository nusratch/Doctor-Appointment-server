import dotenv from "dotenv";

dotenv.config();

import { betterAuth } from "better-auth";

import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { MongoClient } from "mongodb";

const client =
  new MongoClient(
    process.env.MONGODB_URI
  );

await client.connect();

export const auth =
  betterAuth({

    secret:
      process.env.BETTER_AUTH_SECRET,

    baseURL:
      "https://doctor-appointment-server-seven.vercel.app",

    trustedOrigins: [

      "https://doctor-appointment-client-psi.vercel.app",


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