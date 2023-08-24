import express from "express"
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import {Server} from "socket.io"
import "./dao/dbConfig.js"

import ViewRouter from "./routes/views.router.js"
import ProductRouter from "./routes/products.router.js"
import CartRouter from "./routes/carts.router.js"


const app = express()
const PORT = 8080;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname+"/public"))


app.engine("handlebars",handlebars.engine())
app.set("view engine","handlebars")
app.set("views", __dirname+"/views")

app.use("/api", ProductRouter)
app.use("/api", CartRouter)
app.use("/", ViewRouter)

const httpServer = app.listen(PORT, () => {
    console.log("Servidor ONLINE")
})

const socketServer = new Server(httpServer)

// import ProductManager from "./dao/filemanagers/controllers/ProductManager.js"

// const pmanagerSocket = new ProductManager(__dirname+"/dao/filemanagers/db/products.json")

import ProductManager from "./dao/mongomanagers/productManagerMongo.js"
const pmanagerSocket=new ProductManager()

import MessagesManager from "./dao/mongomanagers/messageManagerMongo.js";
const messagesManager = new MessagesManager();


socketServer.on("connection", async (socket) => {
    console.log("Client Connected with ID:", socket.id)
    const products = await pmanagerSocket.getProducts({})
    socketServer.emit("myProducts", products)

    socket.on("addProduct", async(obj)=>{
        await pmanagerSocket.addProduct(obj)
        const products = await pmanagerSocket.getProducts({})
        socketServer.emit("myProducts", products)
    })

    socket.on("deleteProduct", async(id)=>{
        await pmanagerSocket.deleteProduct(id)
        const products = await pmanagerSocket.getProducts({})
        socketServer.emit("myProducts", products)
    })

    socket.on("nuevousuario",(usuario)=>{
        console.log("usuario" ,usuario)
        socket.broadcast.emit("broadcast",usuario)
       })
       socket.on("disconnect",()=>{
           console.log(`Usuario con ID : ${socket.id} esta desconectado `)
       })
       socket.on("mensaje", async (info) => {
        console.log(info)
        await messagesManager.createMessage(info);
        socketServer.emit("chat", await messagesManager.getMessages());
      });

})


