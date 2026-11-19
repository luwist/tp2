import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum EventType {
  Login = 'login',
  ProfileVisit = 'profile_visit',
  Like = 'like',
}

@Schema()
export class StatEvent {
  @Prop({ type: String, enum: EventType, required: true, index: true })
  type: EventType;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  targetUser?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', index: true })
  post?: Types.ObjectId;

  @Prop({ default: Date.now, index: true })
  createdAt: Date;
}

export type StatEventDocument = HydratedDocument<StatEvent>;
export const StatEventSchema = SchemaFactory.createForClass(StatEvent);

StatEventSchema.index({ type: 1, createdAt: 1 });
