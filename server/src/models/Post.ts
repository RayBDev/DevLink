import { model, Schema, Types } from 'mongoose';

interface IPost {
  user: Types.ObjectId;
  text: string;
  name?: string;
  avatar?: string;
  likes?: {
    user: Types.ObjectId;
  }[];
  comments?: {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    text: string;
    name?: string;
    avatar?: string;
  }[];
}

const postSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    text: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    avatar: {
      type: String,
    },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'users',
        },
        name: {
          type: String,
        },
        avatar: {
          type: String,
        },
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'users',
        },
        text: {
          type: String,
          require: true,
        },
        name: {
          type: String,
        },
        avatar: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Post = model<IPost>('Post', postSchema);
