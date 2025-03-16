import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; 
        if (!token) {
            return res.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        req.user = decoded
        next(); 

    } catch (error) {
        res.status(401).json({ message: "Token ไม่ถูกต้อง", error: error.message });
    }
};


export default authenticate