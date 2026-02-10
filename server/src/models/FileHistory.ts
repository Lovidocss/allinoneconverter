import mongoose, { Document, Schema } from "mongoose";

export interface IFileHistory extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  originalName: string;
  fileSize: number; // in bytes
  fileType: string; // e.g., "application/pdf"
  toolUsed: string; // e.g., "merge-pdf", "compress-pdf"
  toolName: string; // e.g., "Merge PDF", "Compress PDF"
  status: "processing" | "completed" | "failed";
  resultUrl?: string; // URL to download the result
  errorMessage?: string;
  processingTime?: number; // in milliseconds
  createdAt: Date;
  updatedAt: Date;
}

const FileHistorySchema = new Schema<IFileHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    toolUsed: {
      type: String,
      required: true,
    },
    toolName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
    resultUrl: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
    processingTime: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
FileHistorySchema.index({ userId: 1, createdAt: -1 });

export const FileHistory = mongoose.model<IFileHistory>("FileHistory", FileHistorySchema);
