const express = require('express')
const cors = require('cors')
const aws = require('aws-sdk')

const app = express()
app.use(cors())
app.use(express.json())

aws.config.update({
    region: "ap-southeast-2",
    endpoint: "http://localhost:8000"
  });

const dynamodb = new aws.DynamoDB();


//CREATE
app.post('/products',(req,res)=>{
    let product = {
        ProductId : {N:req.body.id},
        ProductName : {S:req.body.name},
        Price : {N:req.body.price}
    }
    const params = {
        TableName: "Products",
        Item: product
    }
    dynamodb.putItem(params,(err)=>{
        if(err){
            res.json(err)
        }
        res.json(`Successfully created product ${req.body.id}`)
    })
    
})

//READ
app.get('/products',(req,res)=>{
    const params = {
        TableName: "Products",
    }
    dynamodb.scan(params,(err,data)=>{
        if(err){
            res.json(err)
        }
        res.json(data.Items)
    })
    
})

//UPDATE
app.put('/product/:id',(req,res)=>{
    const productId = req.params.id

    let product = {
        ProductId : {N:productId},
        ProductName : {S:req.body.name},
        Price : {N:req.body.price}
    }
    const params = {
        TableName: "Products",
        Item: product
    }
    dynamodb.putItem(params,(err)=>{
        if(err){
            res.json(err)
        }
        res.json(`Updated product ${productId}`)
    })
})

//DELETE
app.delete('/product/:id',(req,res)=>{
    const productId = req.params.id

    const params = {
        TableName: "Products",
        Key: {
            ProductId:{N: productId}
        }
    }
    dynamodb.deleteItem(params,(err)=>{
        if(err){
            res.json(err)
        }
        res.json(`Deleted product ${productId}`)
    })
    
})


app.listen(3000,()=>{
    console.log('server is running...')
})