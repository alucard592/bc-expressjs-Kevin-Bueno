import mongoose, { Document, Schema } from 'mongoose';

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface IDonante extends Document {
  fullName: string;
  bloodType: BloodType;
  age: number;
  phone: string;
  email: string;
  lastDonationDate?: Date;
  isEligible: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const donanteSchema = new Schema<IDonante>(
  {
    fullName: {
      type: String,
      required: [true, 'El nombre completo es requerido'],
      trim: true,
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, 'El tipo de sangre es requerido'],
    },
    age: {
      type: Number,
      required: [true, 'La edad es requerida'],
      min: [18, 'La edad mínima para donar es 18 años'],
      max: [65, 'La edad máxima para donar es 65 años'],
    },
    phone: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email de contacto es requerido'],
      trim: true,
      lowercase: true,
    },
    lastDonationDate: {
      type: Date,
    },
    isEligible: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const DonanteModel = mongoose.model<IDonante>('Donante', donanteSchema);
