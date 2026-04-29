import mongoose, {Schema, Document} from "mongoose";

export interface IOtp extends Document {
  phone_number: string;
  otp: string;
  expires_at: Date;
}

const OtpSchema: Schema = new Schema({
    phone_number:{type: String, required: true},
    otp:{type: String, required:true},
    expires_at:{type: Date, required:true}
});
OtpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOtp>("Otp", OtpSchema);