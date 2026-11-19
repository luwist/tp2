import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventType, StatEvent } from './entities/stat-event.entity.js';

export interface RecordEventData {
  type: EventType;
  user: Types.ObjectId;
  targetUser?: Types.ObjectId;
  post?: Types.ObjectId;
}

@Injectable()
export class EventsRepository {
  constructor(
    @InjectModel(StatEvent.name)
    private readonly eventModel: Model<StatEvent>,
  ) {}

  async record(data: RecordEventData) {
    return this.eventModel.create({ ...data, createdAt: new Date() });
  }
}
