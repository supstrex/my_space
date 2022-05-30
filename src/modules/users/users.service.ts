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
 
  async createUser(firstname: string, lastname: string, email: string, password: string, passwordConfirm: string){
    const hashedPassword = await bcrypt.hash(password, 10);
      if(password === passwordConfirm){
        const newUser = new this.userModel({ firstname, lastname, email, password : hashedPassword });
        const result = await newUser.save();
        return result.id as string;
      }else{// !! Error handling is not complete
        throw new Error('is not equal password');
      }
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
  async findUser(email: string): Promise<User> {
    const user = await this.userModel.findOne({email}).exec();
    return user;
  }
  async remove(id : string){
    const deleted = await this.userModel.deleteOne({id});
    return deleted;
  }
  async update(id : string, userUp : User): Promise<User>{
    const updated = await this.userModel.findByIdAndUpdate(id,userUp,{new: true});
    return updated;
  }
}