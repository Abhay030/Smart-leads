import { Schema, model, Document, Model, Types } from 'mongoose';
import { LeadStatus, LeadSource } from '../types/lead.types';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface ILeadDocument extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

type ILeadModel = Model<ILeadDocument>;

// ─── Schema ───────────────────────────────────────────────────────────────────

const leadSchema = new Schema<ILeadDocument, ILeadModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      enum: ['Website', 'Instagram', 'Referral'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
  },
  { timestamps: true },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

leadSchema.index({ status: 1, source: 1 }); // combined filter
leadSchema.index({ createdAt: -1 });          // default sort
leadSchema.index({ owner: 1 });               // owner lookup
leadSchema.index({ name: 1, email: 1 });      // search fields

// ─── Model ────────────────────────────────────────────────────────────────────

export const Lead = model<ILeadDocument, ILeadModel>('Lead', leadSchema);
