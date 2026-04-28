import mongoose, { InferSchemaType } from "mongoose";

const taskSchema = new mongoose.Schema(
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
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    relatedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    status: {
      type: String,
      enum: ["To-do", "In Progress", "Done"],
      default: "To-do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export type TaskDocument = InferSchemaType<typeof taskSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Task = mongoose.model("Task", taskSchema);
