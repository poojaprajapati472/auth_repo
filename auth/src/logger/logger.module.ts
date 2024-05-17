import { Module } from '@nestjs/common';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { LOGGER_NAME } from 'src/common/constant';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        // Console transport for logging to the terminal
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(LOGGER_NAME.LOGGER, {
              colors: true,
              prettyPrint: true,
            }),
            winston.format.printf(
              (info: any) =>
                `${info.level}: ${[info.timestamp]} ${info.message} }`,
            ),
          ),
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
