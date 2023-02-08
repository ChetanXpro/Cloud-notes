import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    title: {
      type: String,
      require: true,
    },
    totalNotesInside: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Collection", schema);
