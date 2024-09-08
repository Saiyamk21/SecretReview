import { getServerSession } from "next-auth";
import { authOptions } from "../Auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
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
  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status for accepting message",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to update user status for accepting message", error);
    return Response.json(
      {
        success: false,
        message: "failed to update user status",
      },
      { status: 500 }
    );
  }
}

export async function GET(request:Request){
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
    const userId=user._id;
    try {
        const foundUser=await userModel.findById(userId);
    if (!foundUser) {
        return Response.json(
          {
            success: false,
            message: "User not found",
          },
          { status: 404 }
        );
      }
      return Response.json(
        {
          success: false,
          isAcceptingMessages:foundUser.isAcceptingMessage,
          message: "User found",
        },
        { status: 200 }
      );
    } catch (error) {
        console.log("error in getting message acceptance step");
        return Response.json(
            {
              success: false,
              message: "error in getting acceptance message status",
            },
            { status: 404 }
          );
    }
}
