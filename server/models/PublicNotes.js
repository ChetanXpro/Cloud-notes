import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    size: { type: String, require: true },
    url: {
      type: String,
      require: true,
    },
    university: {
      type: String,
      require: true,
    },

    
    subject: {
      type: String,
      require: true,
    },
    uploadedBy: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("PublicNotes", schema);
