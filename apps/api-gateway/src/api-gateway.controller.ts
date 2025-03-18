import { Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class ApiGatewayController {
  constructor() // @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  {}

  // @Get('users')
  // getUsers() {
  //   return this.userService.send('get_users', {});
  // }
}
