import express from "express"
import {createServer} from "http"
import {Server} from "socket.io"
import {YSocketIO} from "y-socket.io/dist/server"


const app=express();

const httpserver=createServer(app);


const io=new Server(httpserver,{
    cors:{
        origin: "*",
        methods:["GET","POST"]
    }
})

const ysocketio=new YSocketIO(io);
ysocketio.initialize()

//health check api
app.get('/' ,(req,res)=>{
    res.status(200).json({
message:"api is running",
success:true
    })
})

httpserver.listen(3000,()=>{
    console.log("server is running");
})
