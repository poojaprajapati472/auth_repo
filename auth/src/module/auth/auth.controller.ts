import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseHandler } from 'src/lib/response.handler';
import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { LoginDto, SignupDto } from 'src/dto/user.dto';
import { STATUS_MSG } from 'src/common/constant';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
// import { auth0_protect } from 'src/strategies/authorization.strategy';
import { AuthGuard } from '@nestjs/passport';
import { MessagesPermissions } from 'src/strategies/permission_strategy/permission.enum';
import { PermissionsGuard } from 'src/strategies/permission_strategy/permission.strategy';
// import { UnauthorizedError } from 'express-oauth2-jwt-bearer';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly responseHandler: ResponseHandler,
  ) {}

  @Post('/signup')
  async signup(
    @Req() req: Request,
    @Res() res: Response,
    @Body() signupDto: SignupDto,
  ) {
    try {
      console.log('-----------------', signupDto);
      const newUser = await this.authService.signUp(signupDto);
      return this.responseHandler.sendResponse(
        res,
        HttpStatusCode.Ok,
        true,
        STATUS_MSG.SUCCESS.message,
        newUser,
      );
    } catch (err: any) {
      return await this.responseHandler.sendErrorResponse(
        res,
        err.status,
        err?.message,
        err?.errors,
      );
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() loginDto: LoginDto,
  ) {
    try {
      const newUser = await this.authService.login1(loginDto);
      return this.responseHandler.sendResponse(
        res,
        HttpStatusCode.Ok,
        true,
        STATUS_MSG.SUCCESS.message,
        newUser,
      );
    } catch (err: any) {
      return await this.responseHandler.sendErrorResponse(
        res,
        err.status,
        err?.message,
        err?.errors,
      );
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/getProfile')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    try {
      console.log(req.headers, '1111111111111111111111');
      const userDetails: any = req;
      // console.log(userDetails, '22222222222');
      const userId: number = userDetails.id;
      const getUser = await this.authService.getProfile(userId);
      return this.responseHandler.sendResponse(
        res,
        HttpStatusCode.Ok,
        true,
        STATUS_MSG.SUCCESS.message,
        getUser,
      );
    } catch (err: any) {
      return await this.responseHandler.sendErrorResponse(
        res,
        err.status,
        err?.message,
        err?.errors,
      );
    }
  }
  @UseGuards(PermissionsGuard([MessagesPermissions.READ_ADMIN]))
  @Get('/permission')
  async getuser(@Req() req: Request, @Res() res: Response) {
    try {
      const user = this.authService.getuser_permission();
      return this.responseHandler.sendResponse(
        res,
        HttpStatusCode.Ok,
        true,
        STATUS_MSG.SUCCESS.message,
        user,
      );
    } catch (err) {
      return await this.responseHandler.sendErrorResponse(
        res,
        err.status,
        err?.message,
        err?.errors,
      );
    }
  }

  @Get('auth0/callback')
  @UseGuards(AuthGuard('auth0'))
  async auth0_redirect(@Req() req, @Res() res: Response) {
    try {
      const user = req.user;
      const roleName = 'user';
      const roleId = await this.authService.getRoleId(roleName);
      if (roleId) {
        const roles = await this.authService.assignRoleToUser(
          user.provider_id,
          roleId,
        );
        const permissions = await this.authService.getPermissionsForRole(
          roleId,
        );
        await this.authService.updateUserMetadata(user.provider_id, {
          roles,
          permissions,
        });
      } else {
        return this.responseHandler.sendResponse(
          res,
          HttpStatusCode.Ok,
          true,
          STATUS_MSG.ERROR.message,
        );
      }
      const logged = await this.authService.login(user);
      return this.responseHandler.sendResponse(
        res,
        HttpStatusCode.NotFound,
        true,
        STATUS_MSG.SUCCESS.message,
        logged,
      );
    } catch (error: any) {
      return await this.responseHandler.sendErrorResponse(
        res,
        HttpStatusCode.BadRequest,
        error?.message,
        error?.errors,
      );
    }
  }

  @Get('auth0/login')
  @UseGuards(AuthGuard('auth0'))
  async auth0Login() {
    // AuthGuard handles the authentication flow
  }
}
