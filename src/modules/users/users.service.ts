import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';

// Here we have to fetch data from DB
//export type User = any;

@Injectable()
export class UsersService {
  constructor(@InjectModel("User") private readonly userModel : Model<User>){}

  async createUser(email: string, password: string){
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({ email, password : hashedPassword });
        const result = await newUser.save();
        return result.id as string;
  }

  async getUsers(){
    const users = await this.userModel.find().exec();
    return users as User[];
  }

  async getSingleUser(id : string){
    const user = await this.userModel.findById(id).exec();
    if(!user){
      throw new NotFoundException("Could not find the user")
    }
    return user;
  }
    //Some hard coded users
  // private readonly users = [
  //   {
  //     userId: 1,
  //     email: 'arthur@gmail.com',
  //     password: 'arthur',
  //   },
  //   {
  //     userId: 2,
  //     email: 'arno@gmail.com',
  //     password: 'arno',
  //   },
  //   {
  //       userId: 3,
  //       email: 'rob@gmail.com',
  //       password: 'rob',
  //     },
  // ];

  // async findOne(email: string): Promise<User | undefined> {
  //   return this.users.find(user => user.email === email);
  // }
  async findUser(email: string): Promise<User> {
    const user = await this.userModel.findOne({email}).exec();
    return user;
  }
}