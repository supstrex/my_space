import { Controller, Request, Post, UseGuards, Get, Body, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service'; 

@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}
    @Post()
    async create(
        @Body('email') email: string,
        @Body('password') password: string
    ){
       const generatedId = await this.usersService.createUser(email, password)
       return {id: generatedId};
    }
    @Get()
    async getAllUsers(){
        const users = await this.usersService.getUsers();
        return users;
    }
    @Get(":id")
    async getUser(@Param('id') userId: string){
        const user = await this.usersService.getSingleUser(userId);
        return user;
    }
    
}