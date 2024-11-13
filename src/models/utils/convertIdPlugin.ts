import { Schema } from "mongoose";

export const convertIdPlugin = (schema: Schema) => {
    schema.post('find', function(docs) {
      docs.forEach((doc: { _id: any; id: any; }) => {
        if (doc._id) {
          doc.id = doc._id
          delete doc._id;
        }
      });
    });
  
    schema.post('findOne', function(doc) {
      if (doc && doc._id) {
        doc.id = doc._id
        delete doc._id;
      }
    });
  
    schema.post('findOneAndUpdate', function(doc) {
      if (doc && doc._id) {
        doc.id = doc._id
        delete doc._id;
      }
    });
  };