import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({

    products: {
        type:[
            {
                _id:{
                    type: mongoose.Types.ObjectId,
                    ref: 'Products'
                },
                quantity:{
                    type: Number,
                    default:1
                }
            }
        ],
        default:[]
    }
});

export const cartsModel = mongoose.model('Carts',cartSchema)