import {
  MongoClient,
  ServerApiVersion,
} from "mongodb";

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pcz5eav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client =
  new MongoClient(uri, {

    serverApi: {

      version:
        ServerApiVersion.v1,

      strict: true,

      deprecationErrors: true,

    },

  });

export default client;