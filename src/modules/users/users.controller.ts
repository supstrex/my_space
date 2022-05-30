import { Controller, Request, Post, UseGuards, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service'; 
import { User } from './users.model';
import { CreateUserDto } from './users.dto.ts/usercreate.dto';

@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}
    @Post()
    async create(
        @Body('firstname') firstname: string,
        @Body('lastname') lastname: string,
        @Body('email') email: string,
        @Body('password') password: string,
        @Body('passwordConfirm') passwordConfirm: string,
        @Body() CreateUserDto: CreateUserDto
    ){
        // !! Error handling is not complete
        try {
            const generatedId = await this.usersService.createUser(firstname, lastname, email, password, passwordConfirm);
            return {id: generatedId};
        } catch (error) {
            throw new Error(error);
        }
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
    @Delete(":id")
    async remove(@Param('id') userId: string){
        return this.usersService.remove(userId);
    }
    @Put(":id")
    async update(@Param('id') userId: string, @Body() userUp: User){
        return this.usersService.update(userId,userUp);
    }
}