import { Router } from "express";
import ProductManager from "../dao/mongomanagers/productManagerMongo.js";
import { __dirname } from "../utils.js";

//import ProductManager from "../dao/filemanagers/controllers/ProductManager.js"
//const pmanager = new ProductManager(__dirname+"/dao/filemanagers/db/products.json")

const pmanager = new ProductManager()

const router = Router()

router.get("/", async (req,res)=>{
    const listProducts = await pmanager.getProducts({})
    res.render("home", {listProducts})
})

router.get("/realtimeproducts", (req,res)=>{
    res.render("realTimeProducts")
})

router.get("/chat",(req,res)=>{
    res.render("chat")
})



export default router