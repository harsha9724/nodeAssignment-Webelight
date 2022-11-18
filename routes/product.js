const express = require("express");
const bodyparser = require("body-parser");
const router = express.Router();
const Products = require("../models/products");
const { validateToken } = require("../middlewares/middleware");
router.use(bodyparser());
/**
 * ******* swagger schema ********
 */
/**
 * @swagger
 *  components:
 *      schema:
 *          product:
 *              type: object
 *              properties:
 *                    product_id:
 *                          type: integer
 *                    product_category:
 *                          type: string
 *                    product_name:
 *                          type: string
 *                    product_price:
 *                          type: integer
 *          updateproduct:
 *              type: object
 *              properties:
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
 *      summary: this api is  to add the products from authorized user
 *      description: this api is to store data to database.
 *      parameters:
 *         - in: header
 *           name: auth
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

router.post("/api/products/addproducts", validateToken, async (req, res) => {
  try {
    const Product = await Products.create({
      product_id: req.body.product_id,
      product_category: req.body.product_category,
      product_name: req.body.product_name,
      product_price: req.body.product_price,
      user: req.user,
    });
    res.status(200).json({
      message: "product addded successfully",
      item: Product,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});
/**
 * ******** to get all products available***********
 */
/**
 * @swagger
 * /api/products:
 *  get:
 *      summary: To get all products from mongoDB
 *      description: this api is used to fetch the data from mongoDb
 *      responses:
 *          200:
 *              description: this api is used to fetch the data from mongoDb
 *              content:
 *                  application/json:
 *                         schema:
 *                             type: array
 *                             items:
 *                                $ref: "#components/schema/product"
 *
 */

router.get("/api/products", async (req, res) => {
  try {
    const data = await Products.find();
    res.status(200).json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

/**
 * ******** to get  products according to page number***********
 */
/**
 * @swagger
 * /api/products/{pageNumber}:
 *  get:
 *      summary: To get all products according to page number
 *      description: this api is used to fetch the data from mongoDb
 *      parameters:
 *          - in: path
 *            name: pageNumber
 *            required: true
 *            description: Numeric Page Number is required
 *            schema:
 *               type: integer
 *      responses:
 *          200:
 *              description: this api is used to fetch the data from mongoDb
 *              content:
 *                  application/json:
 *                         schema:
 *                             type: array
 *                             items:
 *                                $ref: "#components/schema/product"
 *
 */

router.get("/api/products/:pageNumber", async (req, res) => {
  try {
    const { pageNumber } = req.params;
    console.log(pageNumber);
    const data = await Products.find()
      .skip((Number(pageNumber) - 1) * 2)
      .limit(2);
    res.status(200).json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});
/**
 * **** filter products based on price *****
 */
/**
 * @swagger
 * /api/filter/products:
 *  get:
 *      summary: To get filtered list of products based on price
 *      description: this api is used to fetch the data from mongoDb
 *      parameters:
 *          - in: query
 *            name: min
 *            required: true
 *            description: minmum price
 *            schema:
 *               type: integer
 *          - in: query
 *            name: max
 *            required: true
 *            description: maximum price
 *            schema:
 *               type: integer
 *      responses:
 *          200:
 *              description: this api is used to fetch the filtered data from mongoDb
 *              content:
 *                  application/json:
 *                         schema:
 *                             type: array
 *                             items:
 *                                $ref: "#components/schema/product"
 */

router.get("/api/filter/products", async (req, res) => {
  try {
    const min =parseInt(req.query.min) ;
    const max =parseInt(req.query.max) ;
    // console.log(min, max);
    let data = await Products.find({
      $and: [
        { product_price: { $gte:Number(min) } },
        { product_price: { $lte:Number(max) } },
      ],
    });
    // console.log(data);
    if (data.length > 0) {
      res.status(200).json({
        data,
      });
    } else {
      res.json({
        message: "products not available",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
});

/**
 * ****** update the products ********
 */

/**
 * @swagger
 * /api/products/{product_id}:
 *  put:
 *      summary: To update product price  form authorized user
 *      description: this api is used to fetch the data from mongoDb
 *      parameters:
 *          - in: header
 *            name: auth
 *            required: true
 *            description: an authorization header
 *            type: string
 *          - in: path
 *            name: product_id
 *            required: true
 *            description: product id is required
 *            schema:
 *               type: integer
 *      requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                      schema:
 *                          $ref: "#components/schema/updateproduct"
 *      responses:
 *          200:
 *              description: updated successfully
 *
 */
router.put("/api/products/:product_id", validateToken, async (req, res) => {
  try {
    let product = await Products.find({
      $and: [
        { product_id: { $eq: req.params.product_id } },
        { user: { $eq: req.user } },
      ],
    });
    if (product.length > 0) {
      const data = await Products.updateOne(
        {
          $and: [
            { product_id: { $eq: req.params.product_id } },
            { user: { $eq: req.user } },
          ],
        },
        {
          $set: { product_price: req.body.product_price },
        }
      );
      console.log(data);
      res.status(200).json({
        status: "updated successfully",
        data,
      });
    } else {
      return res.status(501).json({
        message: "product not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});
/**
 * ***** delete products *********
 */

/**
 * @swagger
 * /api/deleteproduct/{product_id}:
 *  delete:
 *      summary: This api is for delete product form authorized user
 *      description: this api is used to fetch the data from mongoDb
 *      parameters:
 *          - in: header
 *            name: auth
 *            required: true
 *            description: an authorization header
 *            type: string
 *          - in: path
 *            name: product_id
 *            required: true
 *            description: product id is required
 *            schema:
 *               type: integer
 *      responses:
 *          200:
 *              description: deleted successfully
 *          500:
 *              description: product not found
 *
 */
router.delete(
  "/api/deleteproduct/:product_id",
  validateToken,
  async (req, res) => {
    try {
      let product = await Products.find({
        $and: [
          { product_id: { $eq: req.params.product_id } },
          { user: { $eq: req.user } },
        ],
      });
      if (product.length > 0) {
        const data = await Products.deleteOne({
          $and: [
            { product_id: { $eq: req.params.product_id } },
            { user: { $eq: req.user } },
          ],
        });
        res.status(200).json({
          status: "deleted successfully",
          data,
        });
      } else {
        return res.status(500).json({
          message: "product not found",
        });
      }
    } catch (err) {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    }
  }
);

module.exports = router;
