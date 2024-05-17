import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { InsufficientScopeError } from 'express-oauth2-jwt-bearer';

function createPermissionsGuard(
  requiredRoutePermissions: string[],
): Type<CanActivate> {
  @Injectable()
  class PermissionsGuardImpl implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const istoken = this.extractTokenFromHeader(request);

      if (istoken) {
        try {
          const decodedToken: any = jwt.decode(istoken, { complete: true });
          console.log(decodedToken.payload.permissions, 'Decoded Token');
          if (decodedToken) {
            const permissionsJwtClaim =
              (decodedToken.payload.permissions as string[]) || [];
            const hasRequiredRoutePermissions = requiredRoutePermissions.every(
              (requiredRoutePermission) =>
                permissionsJwtClaim.includes(requiredRoutePermission),
            );
            if (!hasRequiredRoutePermissions) {
              throw new InsufficientScopeError();
            }
            return true;
          }
        } catch (error) {
          if (error instanceof InsufficientScopeError) {
            throw new ForbiddenException('Insufficient scope');
          } else {
            throw new ForbiddenException('Permission denied');
          }
        }
      } else {
        throw new ForbiddenException('No token provided');
      }

      return false;
    }
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  return PermissionsGuardImpl;
}

export const PermissionsGuard = (
  routePermissions: string[],
): Type<CanActivate> => createPermissionsGuard(routePermissions);
