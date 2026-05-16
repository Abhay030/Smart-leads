import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types/user.types';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type IUserModel = Model<IUserDocument>;

// ─── Schema ───────────────────────────────────────────────────────────────────

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // ← excluded from all queries unless explicitly .select('+password')
    },
    role: {
      type: String,
      enum: ['admin', 'sales'],
      default: 'sales',
    },
  },
  {
    timestamps: true,
  },
);

// ─── Pre-save Hook: Hash Password ─────────────────────────────────────────────

userSchema.pre('save', async function (next) {
  // Only hash when password field has been modified
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method: Compare Password ────────────────────────────────────────

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  // `this.password` is available here even though select: false
  // because this is called on a document that was explicitly fetched with +password
  return bcrypt.compare(candidatePassword, this.password as string);
};

// ─── Model ────────────────────────────────────────────────────────────────────

export const User = model<IUserDocument, IUserModel>('User', userSchema);
