import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { User0Repository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user0Repository: User0Repository,
  ) {}

  async findOne(options: any): Promise<User | undefined> {
    return this.user0Repository.findOne(options);
  }

  async add(user: User) {
    const user1 = this.user0Repository.save(user);
    return user1;
  }
}
