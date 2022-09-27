import { model, Schema } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  hash: string;
  avatar?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    hash: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
