import { auth } from "../server/auth.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} from "mongodb";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.all("/api/auth/*", async (req, res) => {
  return auth.handler(req, res);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pcz5eav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const doctorsCollection = client
  .db("docappoint")
  .collection("doctors");

const appointmentsCollection = client
  .db("docappoint")
  .collection("appointments");

const usersCollection = client
  .db("docappoint")
  .collection("users");

const verifyToken = (
  req,
  res,
  next
) => {

  const authorization =
    req.headers.authorization;

  if (!authorization) {

    return res.status(401).send({
      message: "Unauthorized Access",
    });

  }

  const token =
    authorization.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {

      if (err) {

        return res.status(401).send({
          message:
            "Unauthorized Access",
        });

      }

      req.decoded = decoded;

      next();

    }
  );

};

app.get("/", (req, res) => {

  res.send(
    "DocAppoint Backend Server Running"
  );

});

app.get(
  "/doctors",
  async (req, res) => {

    try {

      const result =
        await doctorsCollection
          .find()
          .toArray();

      res.send(result);

    } catch (error) {

      console.log(error);

      res.status(500).send({
        message:
          "Failed to get doctors",
      });

    }

  }
);

app.get(
  "/doctors/:id",
  async (req, res) => {

    try {

      const id = req.params.id;

      const result =
        await doctorsCollection.findOne({
          id,
        });

      res.send(result);

    } catch (error) {

      console.log(error);

      res.status(500).send({
        message:
          "Failed to get doctor",
      });

    }

  }
);

app.post("/jwt", async (req, res) => {

  const user = req.body;

  const token = jwt.sign(
    user,
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.send({ token });

});

app.post(
  "/register",
  async (req, res) => {

    try {

      const user = req.body;

      const existingUser =
        await usersCollection.findOne({
          email: user.email,
        });

      if (existingUser) {

        return res.status(400).send({
          message:
            "User already exists",
        });

      }

      const result =
        await usersCollection.insertOne(
          user
        );

      res.send(result);

    } catch (error) {

      console.log(error);

      res.status(500).send({
        message:
          "Registration failed",
      });

    }

  }
);

app.post("/login", async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    const user =
      await usersCollection.findOne({
        email,
      });

    if (!user) {

      return res.status(401).send({
        message: "User not found",
      });

    }

    if (
      user.password !== password
    ) {

      return res.status(401).send({
        message: "Wrong password",
      });

    }

    const token = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.send({
      token,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      message:
        "Login failed",
    });

  }

});

app.post(
  "/appointments",
  async (req, res) => {

    try {

      const appointment =
        req.body;

      const result =
        await appointmentsCollection.insertOne(
          appointment
        );

      res.send(result);

    } catch (error) {

      console.log(error);

      res.status(500).send({
        message:
          "Failed to create appointment",
      });

    }

  }
);

app.get(
  "/appointments",
  async (req, res) => {

    try {

      const email =
        req.query.email;

      let query = {};

      if (email) {

        query = {
          userEmail: email,
        };

      }

      const result =
        await appointmentsCollection
          .find(query)
          .toArray();

      res.send(result);

    } catch (error) {

      console.log(error);

      res.status(500).send({
        message:
          "Failed to get appointments",
      });

    }

  }
);

app.patch(
  "/appointments/:id",
  async (req, res) => {

    try {

      const id =
        req.params.id;

      const filter = {
        _id: new ObjectId(id),
      };

      const updatedAppointment =
        req.body;

      const updatedDoc = {

        $set: {

          patientName:
            updatedAppointment.patientName,

          gender:
            updatedAppointment.gender,

          phone:
            updatedAppointment.phone,

          appointmentDate:
            updatedAppointment.appointmentDate,

          appointmentTime:
            updatedAppointment.appointmentTime,

        },

      };

      const result =
        await appointmentsCollection.updateOne(
          filter,
          updatedDoc
        );

      res.send(result);

    } catch (error) {

      console.log(error);

      res.status(500).send({
        message:
          "Failed to update appointment",
      });

    }

  }
);

app.delete(
  "/appointments/:id",
  async (req, res) => {

    try {

      const id =
        req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result =
        await appointmentsCollection.deleteOne(
          query
        );

      res.send(result);

    } catch (error) {

      console.log(error);

      res.status(500).send({
        message:
          "Failed to delete appointment",
      });

    }

  }
);

export default app;