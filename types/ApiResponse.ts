import { Message } from "@/model/User";

export interface ApiResponse{
    success:boolean;
    message:string;
    AcceptingMessage?:boolean;
    Messages?:Array<Message>
}