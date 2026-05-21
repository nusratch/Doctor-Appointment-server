import dotenv from "dotenv";
dotenv.config();

import { betterAuth } from "better-auth";

export const auth = betterAuth({

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: "http://localhost:5000",

  trustedOrigins: [
    "http://localhost:513",
  ],

  socialProviders: {

    google: {

      clientId: process.env.GOOGLE_CLIENT_ID,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

    },

  },

});