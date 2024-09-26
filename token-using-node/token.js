const express = require("express")
const bodyParser = require("body-parser")
const port = 3000
const app = express()

app.use(bodyParser.json());

var balances = {};
var allowance = {};  

app.post("/create",(req,res)=>{
    const {userId,initialBal } = req.body;
    if (balances[userId])
        res.status(401).send("Already account exists");
    else {
        balances[userId] = initialBal;
        res.status(201).send("Account created successfully");
    }
})

app.get("/balance/:id",(req,res)=>{
    const userId = req.params.id;
    if(balances[userId])
        res.status(200).send({user: userId,balance : balances[userId]})
    else    
        res.status(404).send("User Not found");
})

app.post("/allow",(req,res)=>{
    const {userId,spender,amount} = req.body;
    if(!balances[userId] || !balances[spender])
        res.status(400).send("Account doesn't exist");
    if(!allowance[userId])
        allowance[userId] = {};
    allowance[userId][spender] = amount;
    res.status(201).send(`${userId} has allowed ${spender} to spend ${amount}`)
})
app.post("/transfer",(req,res)=>{
    const {from,to,amount} = req.body;
    if (!balances[from] || !balances[to]) {
        res.status(404).send("User Not found");
    }else if(!balances[from] < amount)
        res.status(400).send("Funds not sufficient");
    else{
        balances[from] -= amount;
        balances[to] += amount;
        res.status(200).send(`Transfer ${amount} successful from ${from} to ${to}`);
    }
})
app.post("/transferFrom",(req,res)=>{
    const {from,to,amount} = req.body;
    if(!balances[from] || !balances[to])
        res.status(400).send("Account doesn't exist");
    const allowedAmount = allowance[from] && allowance[from][to]
    if(!allowedAmount || allowedAmount <amount)
        res.status(400).send("Insufficient funds");

    balances[from] -= amount;
    balances[to] += amount;
    allowance[from][to] -= amount;
    res.status(200).send(`Transfer ${amount} successful from ${from} to ${to}`);
})
app.listen(port,()=>{
    console.log("Token server started");
})

