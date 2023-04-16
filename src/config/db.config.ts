import mongoose, * as Mongoose from "mongoose";
import { load } from 'ts-dotenv';

const env = load({
    ATLAS_DB_URL: String,
});

let connection: Mongoose.Connection;

export const connect = () => {
    const url = env.ATLAS_DB_URL;

    if (connection) { return; }

    Mongoose.connect(url)
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