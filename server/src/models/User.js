import mongoose from 'mongoose';

const ROLES = ['tenant', 'owner', 'admin'];
const AUTH_PROVIDERS = ['email', 'google', 'both'];

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    photo: {
      type: String,
      default: '',
    },
    passwordHash: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ROLES,
      default: 'tenant',
    },
    phone: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    authProvider: {
      type: String,
      enum: AUTH_PROVIDERS,
      default: 'email',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    _id: this._id,
    firebaseUid: this.firebaseUid,
    name: this.name,
    email: this.email,
    photo: this.photo,
    role: this.role,
    phone: this.phone,
    isActive: this.isActive,
    authProvider: this.authProvider,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model('User', userSchema);

export default User;
