import { model, Schema, SchemaType, Types } from 'mongoose';

interface IProfile {
  user: Types.ObjectId;
  handle: string;
  company?: string;
  website?: string;
  location?: string;
  status: string;
  skills?: string[];
  bio?: string;
  githubusername?: string;
  experience?: {
    _id?: Types.ObjectId;
    title: string;
    company: string;
    location?: string;
    from: Date;
    to?: Date;
    current?: boolean;
    description?: string;
  }[];
  education?: {
    _id?: Types.ObjectId;
    school: string;
    degree: string;
    fieldofstudy: string;
    from: Date;
    to?: Date;
    current?: boolean;
    description?: string;
  }[];
  social?: {
    youtube?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
}

// Create Schema
const profileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    handle: {
      type: String,
      required: true,
      max: 40,
    },
    company: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    bio: {
      type: String,
    },
    githubusername: {
      type: String,
    },
    experience: [
      {
        title: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        location: {
          type: String,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    education: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        fieldofstudy: {
          type: String,
          required: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    social: {
      youtube: {
        type: String,
      },
      twitter: {
        type: String,
      },
      facebook: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      instagram: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export const Profile = model<IProfile>('Profile', profileSchema);
