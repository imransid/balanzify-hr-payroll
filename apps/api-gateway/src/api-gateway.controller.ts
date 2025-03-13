import { Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GoogleAuthGuard } from 'apps/user-service/src/guard/google-auth/google-auth.guard';

@Controller()
export class ApiGatewayController {
  constructor( @Inject('USER_SERVICE') private readonly userService: ClientProxy) {}

  @Get('users')
  getUsers() {
    return this.userService.send('get_users', {});
  }
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return this.userService.send('google_login', {});
  }
  @Get('auth/google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCallBack() {
    return this.userService.send('google_callback', {});
  }
}
