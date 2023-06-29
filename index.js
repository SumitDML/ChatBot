const express = require("express")
const body_parser = require("body-parser")
const axios = require("axios");
require("dotenv").config();

// const token = process.env.TOKEN;
// const mytoken = process.env.MYTOKEN;
const token = "EAAPZAvZBWBcaoBAFZAL1Yj9b9iZCIWxvI7WbccHADV1BLd0eQ8ITZBPJZBPZBDRZAPTeIINVSUcbs6ZBXnhkQw7e4ZCrWz4gfKuzzRrGvFSVrG0AlX9MikHQaIWGOwrMd3f0xLHmWlF1GZA04dJ8zZCuQg2LfxAQL5kLcTmmZCqgYeJusyOxuwQVKIgeZAhN0CagsxwwHSHOVOeImXZCQZDZD";
const mytoken = "sumit";

const app = express().use(body_parser.json());


app.listen(process.env.PORT,()=>{
    console.log("Webhook is running!!!");
});


//to verify the callback url coming from the facebook dashboard
app.get("/webhooks",(req,res)=>{
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];

    if(mode && token){
        if(mode==="subscribe" && token===mytoken){
            res.status(200).send(challenge);
        }
        else{ 
            console.log("Hello World!!");
            console.log("New Changes!!!");
            res.status(403);
        }
    }
});

app.post("/webhooks",(req,res)=>{

    let body_param = req.body;
    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        if(body_param.entry 
            && body_param.entry[0].changes 
            && body_param.entry[0].changes[0].values.message 
            && body_param.entry[0].changes[0].values.message[0]){

                let phn_no_id = req.body.entry[0].changes[0].values.metadata.phone_number_id;
                let from = req.body.entry[0].changes[0].values.messages[0].from;
                let msg_body = req.body.entry[0].changes[0].values.messages[0].text.body;

                
                axios({
                    method:"POST",
                    url:"https://graph.facebook.com/v16.0/"+phn_no_id+"/messages?access_token="+token,
                    data:{
                        "messaging_product": "whatsapp",
                        "to": from,
                        "text": {
                            "body": "Hey Welcome to Aloum Daum!! How can we help you??"
                        }
                    },
                    headers:{
                        "Content-Type": "application/json"
                    }
                });

                res.sendStatus(200);
            }
            else{
                res.sendStatus(404);
            }
    }

});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is a webhook for Aloum Daum chatbot")
});