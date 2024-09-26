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

app.post("/transfer",(req,res)=>{
    const {from,to,amount} = req.body;
    if (!balances[from] || !balances[to]) {
        res.status(404).send("User Not found");
    }else if(!balances[from] < amount)
        res.status(400).send("Funds not sufficient");
    else{
        balances[from] -= amount;
        balances[to] += amount;
        res.status(200).send("Transfer successful");
    }
})
app.listen(port,()=>{
    console.log("Token server started");
})

