import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  tenantId?: string;
  refreshTokenVersion?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Add methods interface
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create a new Model type that knows about IUserMethods
export type UserModel = Document<unknown, {}, IUser> & IUser & IUserMethods;

const userSchema = new mongoose.Schema<IUser, mongoose.Model<IUser>, IUserMethods>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  tenantId: {
    type: String,
    required: false,
  },
  refreshTokenVersion: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

export const User = mongoose.model<IUser, mongoose.Model<IUser, {}, IUserMethods>>('User', userSchema); 