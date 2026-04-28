import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["get-started", "service-request"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    serviceName: {
      type: String,
      trim: true,
      default: "",
    },
    budget: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    acceptedTerms: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Converted"],
      default: "New",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const Lead = mongoose.model("Lead", leadSchema);
