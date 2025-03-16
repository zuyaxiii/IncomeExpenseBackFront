import userService from "./authService.js"


const userController = {
    register : async (req ,res) => {
        try {
            const {username , password} = req.body
            const user = await userService.register(username , password);
            res.status(201).json({ message: "User registered successfully", user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    login : async(req,res) => {
        try {
            const { username, password } = req.body;
            const token = await userService.login(username, password);
            res.status(200).json({ message: "Login successful", token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default userController