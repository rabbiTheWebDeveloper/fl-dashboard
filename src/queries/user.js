import { userModel } from "@/model/user-model";
import { dbConnect } from "@/service/mongo";
import bcrypt from "bcryptjs";
export async function passwordChange(credentials) {
  if (credentials == null) return null;
  await dbConnect();
  try {
    const user = await userModel.findOne({ email: credentials.email });

    if (user) {
      const isMatch = await bcrypt.compare(
        credentials.currentPassword,
        user.password
      );
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(credentials.newPassword, 5);
        const updateUser = await userModel.findOneAndUpdate(
          { email: credentials.email },
          { password: hashedPassword }
        );
        // console.log(updateUser);
        return JSON.parse(JSON.stringify(updateUser));
      } else {
        throw new Error("Email or password mismatch");
      }
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function updatePersonalInfo(data) {
  await dbConnect();
  try {
    const user = await userModel.findOne({ email: data.email });
    if (user) {
      const updateUser = await userModel.findOneAndUpdate(
        { email: data.email },
        data
      );
      return JSON.parse(JSON.stringify(updateUser));
    }
  } catch (error) {
    throw new Error(error);
  }
}

// export async function updatePersonalInfo(data) {
//   await dbConnect();
//   try {} catch (error) {
//     throw new Error(error);
//   }

export async function getUsers(email) {
  await dbConnect();
  try {
    const user = await userModel.findOne({ email: email });
    return user ? JSON.parse(JSON.stringify(user)) : null; // Replace with your desired format (e.g., ;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAllUsers() {
  await dbConnect();
  try {
    const user = await userModel.find({}).sort({ createdAt: -1 }).lean();
    return user ? JSON.parse(JSON.stringify(user)) : null; // Replace with your desired format (e.g., ;
  } catch (error) {
    throw new Error(error);
  }
}
export async function getUsersBalance(userId) {
  await dbConnect();
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const balance = user.balance;
    return user ? JSON.parse(JSON.stringify({ balance })) : null; // Replace with your desired format (e.g., ;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUsersByPayment(id) {
  await dbConnect();
  try {
    const user = await userModel.findOne({ _id: id });
    return user ? JSON.parse(JSON.stringify(user?.balance_paid)) : null; // Replace with your desired format (e.g., ;
  } catch (error) {
    throw new Error(error);
  }
}

export async function signup(data) {
  await dbConnect();
  try {
    const newUser = new userModel(data);
    await newUser.save();
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateUserFromDB(id, data) {
  await dbConnect();
  const categories = await userModel.findByIdAndUpdate(id, data, {
    new: false,
  }).lean();
  return JSON.parse(JSON.stringify(categories));
}
