// src/logging/schemas/log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  level: string; // уровень лога (например, "info", "error", "debug")

  @Prop({ required: true })
  message: string; // сообщение лога

  @Prop()
  context?: string; // контекст лога

  @Prop()
  trace?: string; // трассировка лога

  @Prop({ type: Object })
  metadata?: Record<string, any>; // метаданные лога

  // Добавляем поля для информации о пользователе
  @Prop()
  userId?: number; // ID пользователя

  @Prop({ type: Object })
  userInfo?: Record<string, any>; // дополнительная информация о пользователе

  @Prop()
  action?: string; // действие пользователя
}

export const LogSchema = SchemaFactory.createForClass(Log);
