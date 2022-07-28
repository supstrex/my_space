//import { MessageRoom } from '../schema/message.schema';

import { IsNotEmpty } from "class-validator"
import { ObjectId } from "mongoose"

export class CreateMessageDto {
    id: ObjectId
    
    user: string
    
    @IsNotEmpty()
    text: string
}
