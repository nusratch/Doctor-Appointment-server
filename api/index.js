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
    origin: [
      "https://doctor-appointment-client-iu8u9qzlb-nusrats-projects-299df817.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

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

const verifyToken = (req, res, next) => {

  const authorization = req.headers.authorization;

  if (!authorization) {

    return res.status(401).send({
      message: "Unauthorized Access",
    });

  }

  const token = authorization.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {

      if (err) {

        return res.status(401).send({
          message: "Unauthorized Access",
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

app.get("/doctors", async (req, res) => {

  const result =
    await doctorsCollection.find().toArray();

  res.send(result);

});

app.get("/doctors/:id", async (req, res) => {

  const id = req.params.id;

  const result =
    await doctorsCollection.findOne({ id });

  res.send(result);

});

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

app.post("/appointments", async (req, res) => {

  const appointment = req.body;

  const result =
    await appointmentsCollection.insertOne(
      appointment
    );

  res.send(result);

});

app.get(
  "/appointments",
  verifyToken,
  async (req, res) => {

    const email = req.query.email;

    const query = {
      userEmail: email,
    };

    const result =
      await appointmentsCollection
        .find(query)
        .toArray();

    res.send(result);

  }
);

app.patch("/appointments/:id", async (req, res) => {

  const id = req.params.id;

  const filter = {
    _id: new ObjectId(id),
  };

  const updatedAppointment = req.body;

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

});

app.delete("/appointments/:id", async (req, res) => {

  const id = req.params.id;

  const query = {
    _id: new ObjectId(id),
  };

  const result =
    await appointmentsCollection.deleteOne(
      query
    );

  res.send(result);

});

export default app;