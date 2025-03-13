import { Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { UserService } from './user/user.service';
import { GoogleAuthGuard } from './guard/google-auth/google-auth.guard';
import { Public } from './decorator/public.decorator';
@Controller()
export class UserServiceController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get_users')
  getUsers() {
    return this.userService.findAll();
  }

  @MessagePattern('google_login')
  @Public()
  @UseGuards(GoogleAuthGuard)
  //@Get('google/login')
  googleLogin() {}


  @MessagePattern('google_callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  //@Get('auth/google/callback')
  async googleCallback(@Req() req) {
    const response = await this.userService.login({
      email: req.user.email,
      password: '',
    });

    return response;
  }
}
