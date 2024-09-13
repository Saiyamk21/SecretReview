import { getServerSession } from "next-auth";
import { authOptions } from "../../Auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User } from "next-auth";



export async function DELETE(reques:Request,{params}:{params:{messageid:string}}){
    const messageId=params.messageid;
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
    try {
        const updateResult=await userModel.updateOne(
            {_id:user._id},
            {$pull:{message:{_id:messageId}}}
        )
        if(updateResult.modifiedCount==0){
            return Response.json(
                {
                    success: false,
                    message: "Mesage not found or already deleted",
                },
                { status: 404 }
                );
        }
        return Response.json(
            {
                success: true,
                message: "Deleted Sucessfully",
            },
            { status: 200 }
            );
    } catch (error) {
        console.log("error in deleting message",error);
        return Response.json(
            {
                success: false,
                message: "Error deleting message",
            },
            { status: 500 }
            );
    }
    
}