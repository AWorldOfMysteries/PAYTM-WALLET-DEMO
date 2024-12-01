const router = require("express").Router();
const Transaction = require('../models/transactionModel');
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");
const stripe = require("stripe")(process.env.stripe_key);
const { uuid } = require("uuidv4");

// transfer money from one account to another

router.post('/transfer-funds', authMiddleware, async (req, res) => {
    try{
        // save the transaction
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
    
        // decrease the sender's balance
        await User.findByIdAndUpdate(req.body.sender, {
            $inc: { balance: -req.body.amount}
        });

        // increase the receiver's balance
        await User.findByIdAndUpdate(req.body.receiver, {
            $inc: { balance: req.body.amount}
        });

        res.send({
            message: "Transaction successful",
            data: newTransaction,
            success: true
        });


    }
    catch(error){
        res.send({
            message: "Transaction failed",
            data: error.message,
            success: false
        });
    }
})

// verify the receiver's account number

router.post("/verify-account", authMiddleware, async (req, res) => {
    try{
        const user = await User.findOne({ _id: req.body.receiver});
        if(user){
            res.send({
                message: "Account verified",
                data: user,
                success: true
            });
        }
        else{
            res.send({
                message: "Account not found",
                data: null,
                success: false
            });
        }
    }   
    catch(error){
        res.send({
            message: "Account not found",
            data: error.message,
            success: false
        });
    }
});

// get all transactions for a user

router.post('/get-all-transactions-by-user', authMiddleware, async (req, res) => {
    console.log("hi")
    try {
        const transactions = await Transaction.find({
            $or: [{ sender: req.body.userId}, {receiver: req.body.userId}]
        }).sort({createdAt: -1}).populate("sender").populate("receiver");
        res.send({
            message: "Transactions fetched",
            data: transactions,
            success: true,
        });
    } catch (error) {
        res.send({
            message: "Transactions not fetched",
            data: error.message,
            success: false,
        });
    }
});

// deposit funds using stripe

router.post('/deposit-funds', authMiddleware, async (req, res) => {
    const { token, amount } = req.body;
    // const idempotencyKey = uuid();

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        const charge = await stripe.charges.create({
            amount: amount * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `Deposited ${amount} to wallet`,
        }, { 
            idempotencyKey: uuid()
        });
        if (!charge) {
            throw new Error('Charge failed');
        }

        
        if(charge.status==="succeeded"){
            const newTransaction = new Transaction({
                sender: 'stripe',
                receiver: req.body.userId,
                amount,
                type: 'deposit',
                reference: 'stripe deposit',
                status: 'success',
            });
            await newTransaction.save();
            
            await User.findByIdAndUpdate(req.body.userId, {
                $inc: { balance: amount }
            });
        
            res.send({
                message: "Deposit successful",
                data: newTransaction,
                success: true
            });
        }
        else{
            res.send({
                message: "Transaction failed",
                data: charge,
                success: false
            });
        }
    } catch (error) {
        res.send({
            message: "Deposit failed",
            data: error.message,
            success: false
        });
    }
})  

module.exports = router;