import { getServerSession } from "next-auth";
import { authOptions } from "../Auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(reques:Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
        {
            success: false,
            message: "NOt authenticated",
        },
        { status: 401 }
        );
    }
    const userId =new mongoose.Types.ObjectId(user._id);
    try {
        ///aggregation pipeline
        const user=await userModel.aggregate([
            {$match:{id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',$messages:{$push:'$messages'}}}
        ])

        if(!user || user.length==0){
            return Response.json(
                {
                    success: false,
                    message: "user not found",
                },
                { status: 401 }
                );
        }
        return Response.json(
            {
                success: true,
                message: user[0].messages
            },
            { status: 200 }
            );
    } catch (error) {
        console.log("an unexpexted error :",error)
        return Response.json(
            {
                success: false,
                message: "user not found",
            },
            { status: 500 }
            );
    }
}