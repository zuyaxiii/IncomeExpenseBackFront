import Transaction from "./transactionsModel.js"
import mongoose from 'mongoose';
import ExcelJS from 'exceljs'
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const convertToObjectId = (id) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid ObjectId");
    }
    return new mongoose.Types.ObjectId(id);
};

const transactionServices = {
    addTransaction: async (data) => {
        const newTransaction = new Transaction(data)
        return await newTransaction.save()
    },
    getTransaction: async (userId) => {
        const userObjectId = convertToObjectId(userId);
        return await Transaction.find({ userId: userObjectId });
    },
    deleteTransaction: async (id, userId) => {
        const userObjectId = convertToObjectId(userId);
        return await Transaction.findOneAndDelete({ _id: id, userId: userObjectId });
    },
    getBalance: async (userId) => {

        const userObjectId = convertToObjectId(userId);

        const incomes = await Transaction.aggregate([
            { $match: { userId: userObjectId, type: "income" } },
            { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
        ]);
        const expenses = await Transaction.aggregate([
            { $match: { userId: userObjectId, type: "expense" } },
            { $group: { _id: null, totalExpense: { $sum: "$amount" } } },
        ]);
        return (incomes[0]?.totalIncome || 0) - (expenses[0]?.totalExpense || 0);
    },
    searchTransaction: async (userId, date, type) => {

        const userObjectId = convertToObjectId(userId);

        let filter = { userId: userObjectId };

        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setDate(end.getDate() + 1);
            filter.date = { $gte: start, $lt: end };
        }

        if (type) {
            filter.type = type
        }

        return await Transaction.find(filter);

    },
    getSummary: async (userId) => {

        const userObjectId = convertToObjectId(userId);

        const summary = await Transaction.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" },
                },
            },
        ]);

        const result = { income: 0, expense: 0 };
        summary.forEach((item) => {
            if (item._id === "income") {
                result.income = item.total;
            } else if (item._id === "expense") {
                result.expense = item.total;
            }
        });

        return result;
    },
    exportToExcel: async (userId) => {


        const userObjectId = convertToObjectId(userId);

        const transactions = await Transaction.find({ userId: userObjectId });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Transactions")

        worksheet.columns = [
            { header: "ID", key: "_id", width: 25 },
            { header: "ชื่อรายการ", key: "name", width: 30 },
            { header: "ประเภท", key: "type", width: 15 },
            { header: "จำนวนเงิน", key: "amount", width: 15 },
            { header: "วันที่", key: "date", width: 20 },
        ];

        transactions.forEach((Transaction) => {
            worksheet.addRow({
                _id: Transaction._id.toString(),
                name: Transaction.name,
                type: Transaction.type,
                amount: Transaction.amount,
                date: Transaction.date.toISOString().split("T")[0]
            })
        })

        const filePath = path.join(__dirname, "../exports/transactions.xlsx");

        if (!fs.existsSync(path.join(__dirname, "../exports"))) {
            fs.mkdirSync(path.join(__dirname, "../exports"));
        }

        await workbook.xlsx.writeFile(filePath);

        return filePath
    }
}

export default transactionServices;