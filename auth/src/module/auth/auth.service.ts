import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetails } from 'src/entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignupDto } from 'src/dto/user.dto';
import { UserRepository } from './auth.repositoty';
import { UserService } from '../user/user.service';
import { AxiosManager } from 'src/lib/axios-manager';
import { endpoints } from 'src/common/constant';
import { APP_CONFIG } from 'config/configuration';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserDetails)
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    private usersService: UserService,
    private axiosManager: AxiosManager,
  ) {
    const token = APP_CONFIG.management_api_token;
    const apiUrl = APP_CONFIG.api_url;
    this.axiosManager = new AxiosManager(apiUrl, token);
  }

  async signUp(
    signupDto: SignupDto,
  ): Promise<{ token: string; user: UserDetails }> {
    try {
      const { username, email, password } = signupDto;
      const existingUser = await this.userRepository.findOne({
        where: { email: email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user: any = this.userRepository.create({
        id: undefined,
        username,
        email,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      const token = this.jwtService.sign({ id: user.id });
      return { token, user };
    } catch (err) {
      throw err;
    }
  }

  async login1(loginDto: LoginDto): Promise<{ token: string }> {
    try {
      console.log('----------------');
      const { email, password } = loginDto;
      const user = await this.userRepository.findOneBy({ email: email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        throw new BadRequestException('Invalid email or password');
      }
      const token = this.jwtService.sign({ id: user.id });
      return { token };
    } catch (err) {
      throw err;
    }
  }
  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }
  async getProfile(id: any): Promise<UserDetails> {
    try {
      return this.userRepository.findOneBy({ id });
    } catch (err) {
      throw err;
    }
  }
  async getuser_permission(): Promise<string> {
    return 'permission is granted  ';
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.provider_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async validateAuth0User({ username, id }: { username: string; id: string }) {
    let user = await this.usersService.findOne({
      where: { provider: 'auth0', provider_id: id },
    });
    if (!user) {
      user = await this.usersService.add({
        id: null,
        password: '',
        provider: 'auth0',
        username,
        provider_id: id,
      });
    }
    const { password, ...result } = user;
    return result;
  }
  async getRoleId(roleName: string): Promise<string | null> {
    try {
      const roles = await this.axiosManager.get(endpoints.roles);
      if (!roles || roles.length === 0) {
        throw new NotFoundException();
      }
      const role = roles.find((r: any) => r.name === roleName);
      return role ? role.id : null;
    } catch (err) {
      throw err;
    }
  }
  async getPermissionsForRole(roleId: string): Promise<string[] | null> {
    try {
      const permissions = await this.axiosManager.get(
        `${endpoints.roles}/${roleId}${endpoints.permission}`,
      );
      if (!permissions || permissions.length === 0) {
        throw new NotFoundException();
      }
      return permissions.map((permission: any) => permission.permission_name);
    } catch (err) {
      throw err;
    }
  }
  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    const url = `${endpoints.users}/${userId}${endpoints.roles}`;
    try {
      await this.axiosManager.post(url, { roles: [roleId] });
    } catch (err) {
      throw err;
    }
  }

  async updateUserMetadata(userId: string, metadata: object): Promise<void> {
    const url = `${endpoints.users}/${userId}`;
    try {
      await this.axiosManager.patch(url, { user_metadata: metadata });
    } catch (error) {
      throw error;
    }
  }
}
