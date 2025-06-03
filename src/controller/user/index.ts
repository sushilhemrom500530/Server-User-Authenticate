import { Request, Response } from "express";
import User from "../../models/User"


const getAllFromDB = async(req:Request,res:Response)=>{
    try {
    const result = await User.find().select("-password");
    res.status(200).json({ 
        message:"User rettrieve successfully",
        data:result
     });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
}

export const UserController = {
    getAllFromDB
}