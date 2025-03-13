import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from '../user/interfaces/jwtPayload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const ctx =  GqlExecutionContext.create(context).getContext();
  //   if (!ctx.headers.authorization) {
  //     return false;
  //   }
  //   ctx.user = await this.validateToken(ctx.headers.authorization);
  //   return true;
  // }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();

    if (!ctx.headers.authorization) {
      throw new HttpException(
        'Authorization header missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    ctx.user = await this.validateToken(ctx.headers.authorization);


    if (!ctx.user || !ctx.user.id) {
      throw new HttpException('Invalid token payload', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }

  async validateToken(auth: string): Promise<JwtPayload> {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const token = auth.split(' ')[1];
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      return payload;
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }
}
