import mongoose, { InferSchemaType } from "mongoose";

export const vacancyCategories = ["Development", "Design", "Management"] as const;
export const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship"] as const;
export const vacancyStatuses = ["Active", "Inactive"] as const;

const jobVacancySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: vacancyCategories,
      required: true,
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    employmentType: {
      type: String,
      enum: employmentTypes,
      default: undefined,
    },
    status: {
      type: String,
      enum: vacancyStatuses,
      required: true,
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

export type JobVacancyDocument = InferSchemaType<typeof jobVacancySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const JobVacancy = mongoose.model("JobVacancy", jobVacancySchema);
