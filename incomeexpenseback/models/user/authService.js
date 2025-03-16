import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from './authModel.js'

const userService = {
    register: async (username, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword })
        await newUser.save()
        return newUser;
    },
    login: async (username, password) => {
        const user = await User.findOne({ username });
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return token
    }
}

export default userService