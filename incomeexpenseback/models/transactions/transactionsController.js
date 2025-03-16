import transactionServices from "./transactionsService.js";

const transactionController = {
    addTransaction: async (req, res) => {
        try {

            const userId = req.user.userId;
            const { name, amount, date, type } = req.body;

            if (!name || !amount || !date || !type) {
                return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
            }

            const transaction = await transactionServices.addTransaction({ userId, name, amount, date, type });
            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },

    getTransaction: async (req, res) => {
        try {
            const userId = req.user.userId;
            const transactions = await transactionServices.getTransaction(userId);
            res.status(200).json(transactions);
        } catch (error) {
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },

    deleteTransaction: async (req, res) => {
        try {
            const userId = req.user.userId;
            const transaction = await transactionServices.deleteTransaction(req.params.id, userId);
            if (!transaction) {
                return res.status(404).json({ message: "ไม่พบรายการที่ต้องการลบ" });
            }
            res.json({ message: "ลบสำเร็จ" });
        } catch (error) {
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },

    getBalance: async (req, res) => {
        try {
            const userId = req.user.userId;
            const balance = await transactionServices.getBalance(userId);
            res.json({ balance });
        } catch (error) {
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },

    searchTransaction: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { date, type } = req.query;
            const transactions = await transactionServices.searchTransaction(userId, date, type);
            res.status(200).json(transactions);
        } catch (error) {
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },

    getSummary: async (req, res) => {
        try {
            const userId = req.user.userId;
            const summary = await transactionServices.getSummary(userId);
            summary.balance = summary.income - summary.expense;
            res.status(200).json(summary);
        } catch (error) {
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },

    exportToExcel: async (req, res) => {
        try {
            const userId = req.user.userId;
            const filePath = await transactionServices.exportToExcel(userId);

            res.download(filePath, "transactions.xlsx", (err) => {
                if (err) {
                    console.error("Error downloading file:", err);
                    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์" });
                }
            });
        } catch (error) {
            res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    }
};

export default transactionController;
