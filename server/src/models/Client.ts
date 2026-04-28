import mongoose, { InferSchemaType } from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Lead"],
      default: "Active",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export type ClientDocument = InferSchemaType<typeof clientSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Client = mongoose.model("Client", clientSchema);
