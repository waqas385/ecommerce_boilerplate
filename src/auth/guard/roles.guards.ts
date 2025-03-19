import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Role } from 'src/users/enum/role.enum';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private commonService: CommonService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requestHeader = context.switchToHttp().getRequest();
    await this.setInfoToRequestBodyFromJWT(requestHeader);

    if (!requiredRoles || requiredRoles.includes(Role.Public)) {
      return true;
    }

    const isUserAuthorize = await this.isAuthorized(
      requestHeader,
      requiredRoles,
    );

    if (!isUserAuthorize) {
      throw new UnauthorizedException('Unauthorized to access URL');
    }

    return true;
  }

  public async setInfoToRequestBodyFromJWT(req: any) {
    const authToken = req.headers?.authorization;
    if (!authToken) {
      return;
    }

    const [bearer, token] = authToken.split(' ');
    if (!bearer || !token) {
      return;
    }

    try {
      const userDetail = await this.commonService.verifyJWT(token);
      return (req['body']['userInfo'] = userDetail);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // do nothing
    }
  }

  public async isAuthorized(req: any, roles: Role[]): Promise<boolean> {
    const authToken = req.headers?.authorization;
    if (!authToken) {
      return false;
    }
    const [bearer, token] = authToken.split(' ');

    if (!bearer || !token) {
      return false;
    }

    try {
      const userDetail = await this.commonService.verifyJWT(token);
      if (!roles.includes(userDetail.role)) {
        throw new UnauthorizedException('Unauthorized to access URL');
      }
      // Add request data validation i.e passed param and JWT info matches

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
