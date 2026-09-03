import mongoose, { Schema, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  tenantId: string;
  targetUrl: string;
  apiKey: string;
  isActive: boolean;
}

const TenantSchema: Schema = new Schema({
  name: { type: String, required: true },
  tenantId: { type: String, required: true, unique: true },
  targetUrl: { type: String, required: true },
  apiKey: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ITenant>('Tenant', TenantSchema);
