// src/logging/logging.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';

@Injectable()
export class LoggingService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async log(
    level: string,
    message: string,
    context?: string,
    trace?: string,
    metadata?: Record<string, any>,
    userId?: number,
    userInfo?: Record<string, any>,
    action?: string,
  ) {
    const logEntry = new this.logModel({
      level,
      message,
      context,
      trace,
      metadata,
      userId,
      userInfo,
      action,
    });
    return await logEntry.save();
  }

  async info(
    message: string,
    context?: string,
    metadata?: Record<string, any>,
    userId?: number,
    userInfo?: Record<string, any>,
    action?: string,
  ) {
    return this.log(
      'info',
      message,
      context,
      undefined,
      metadata,
      userId,
      userInfo,
      action,
    );
  }

  async warn(
    message: string,
    context?: string,
    metadata?: Record<string, any>,
    userId?: number,
    userInfo?: Record<string, any>,
    action?: string,
  ) {
    return this.log(
      'warn',
      message,
      context,
      undefined,
      metadata,
      userId,
      userInfo,
      action,
    );
  }

  async error(
    message: string,
    context?: string,
    trace?: string,
    metadata?: Record<string, any>,
    userId?: number,
    userInfo?: Record<string, any>,
    action?: string,
  ) {
    return this.log(
      'error',
      message,
      context,
      trace,
      metadata,
      userId,
      userInfo,
      action,
    );
  }

  async debug(
    message: string,
    context?: string,
    metadata?: Record<string, any>,
    userId?: number,
    userInfo?: Record<string, any>,
    action?: string,
  ) {
    return this.log(
      'debug',
      message,
      context,
      undefined,
      metadata,
      userId,
      userInfo,
      action,
    );
  }

  // Специальный метод для логирования действий пользователя
  async userAction(
    userId: number,
    action: string,
    message: string,
    userInfo?: Record<string, any>,
    metadata?: Record<string, any>,
  ) {
    return this.info(message, 'UserAction', metadata, userId, userInfo, action);
  }
}
