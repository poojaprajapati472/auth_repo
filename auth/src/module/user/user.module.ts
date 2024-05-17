import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User0Repository } from './user.repository';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { User } from './user.entity';

@Module({
  imports: [DatabaseModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, User0Repository],
  exports: [UserService, User0Repository],
})
export class UserModule {}
