import { Schema, Types, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  IItemAttributeGroup,
  ItemAttributeGroupSchema,
} from './itemAttributeModel';

// --------------------------------------------------------------------------
// Intereface

export interface ICoupon {
  code: string;
  kind: string;
  value: number;
  redemptions: number;
  redemptions_max: number;
  expiry_date: Date;
}

const CouponSchema = new Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  kind: {
    type: String,
    enum: ['absolute', 'percentage'],
    default: 'percentage',
  },
  value: {
    type: Number,
    required: true,
    default: 0,
  },
  redemptions: {
    type: Number,
    required: true,
    default: 0,
  },
  redemptions_max: {
    type: Number,
    required: true,
    default: 1,
  },
  expiry_date: {
    type: Date,
    required: true,
  },
});

export const Coupon = model<ICoupon>('Coupon', CouponSchema);
