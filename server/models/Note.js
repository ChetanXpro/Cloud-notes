import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    collectionID: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Collection",
    },
    userId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    name: {
      type: String,
      require: true,
    },
    blobName: { type: String, require: true },
    size: { type: String, require: true },
    url: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Note", schema);
