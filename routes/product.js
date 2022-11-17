const express=require("express");
const bodyparser = require("body-parser");
const router=express.Router();
const Products=require("../models/products");
const { validateToken }=require("../middlewares/middleware")
/**
 * ******* product products ********
 */
/**
 * @swagger
 *  components:
 *      schema:
 *          product:
 *              type: object
 *              properties:
 *                    product_id:
 *                          type: string
 *                    product_category:
 *                          type: string
 *                    product_name:
 *                          type: string
 *                    product_price:
 *                          type: integer
 */


/**
 * ******* adding products ********
 */
/**
 * @swagger
 * /api/products/addproducts:
 *  post:
 *      summary: this api is  to add the products
 *      description: this api is to store products to database.
 *      parameters:
 *         - in: header
 *           name: authorization
 *           required: true
 *           description: an authorization header
 *           type: string
 *      requestBody:
 *             required: true
 *             content: 
 *                 application/json:
 *                      schema:
 *                          $ref: "#components/schema/product"
 *      responses:
 *          200:
 *              description: product addded successfully
 *          500:
 *              description: failed
 * 
 */

router.post("/api/products/addproducts",validateToken, async (req,res)=>{
    try{
        const Product=await Products.create({
            product_id:req.body.product_id,
            product_category:req.body.product_category,
            product_name:req.body.product_name,
            product_price:req.body.product_price,
            user:req.user
        });
        res.status(200).json({
            message:"product addded successfully",
            item:Product
        })
    }catch(err){
        res.status(500).json({
            status:"failed",
            message:err.message
        })
    }
});







module.exports=router;