import { ObjectId } from "mongodb";
import client from "../config/db.js";

const appointmentsCollection =
  client.db("docAppointDB").collection("appointments");

export const createAppointment = async (req, res) => {

  try {

    const appointment = req.body;

    const result =
      await appointmentsCollection.insertOne(
        appointment
      );

    res.send(result);

  } catch (error) {

    console.log(error);

    res.status(500).send({
      message: "Failed to create appointment",
    });

  }

};

export const getAppointments = async (req, res) => {

  try {

    const email = req.query.email;

    const query = email
      ? { userEmail: email }
      : {};

    const result =
      await appointmentsCollection
        .find(query)
        .toArray();

    res.send(result);

  } catch (error) {

    console.log(error);

    res.status(500).send({
      message: "Failed to get appointments",
    });

  }

};

export const updateAppointment = async (req, res) => {

  try {

    const id = req.params.id;

    const updatedData = req.body;

    const result =
      await appointmentsCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: updatedData,
        }
      );

    res.send(result);

  } catch (error) {

    console.log(error);

    res.status(500).send({
      message: "Failed to update appointment",
    });

  }

};

export const deleteAppointment = async (req, res) => {

  try {

    const id = req.params.id;

    const result =
      await appointmentsCollection.deleteOne({
        _id: new ObjectId(id),
      });

    res.send(result);

  } catch (error) {

    console.log(error);

    res.status(500).send({
      message: "Failed to delete appointment",
    });

  }

};