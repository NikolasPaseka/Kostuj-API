import mongoose, * as Mongoose from "mongoose";
//require('dotenv').config();

let connection: Mongoose.Connection;

export const connect = () => {
    //const url = process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017/kostuj";
    const url = "mongodb://localhost:27017/kostuj";

    if (connection) {
        return;
    }

    Mongoose.connect('mongodb://localhost:27017/kostuj')
    .then(() => {
        console.log('mongo connection open');
        transformSchemasToClient();
    })
    .catch((err: any) => {
        console.log(`err: ${err}`);
    });
    connection = Mongoose.connection;
}

export const disconnect = () => {
    
    if (!connection) {
      return;
    }
    
    Mongoose.disconnect();

    connection.once("close", async () => {
        console.log("Database connection closed");
    });

};

export default function transformSchemasToClient() {
    mongoose.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: (doc, converted) => {
          delete converted._id;
        }
      });
}