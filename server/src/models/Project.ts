import mongoose, { InferSchemaType } from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Running", "Completed"],
      default: "Pending",
    },
    deadline: {
      type: Date,
    },
    budget: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export type ProjectDocument = InferSchemaType<typeof projectSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Project = mongoose.model("Project", projectSchema);
