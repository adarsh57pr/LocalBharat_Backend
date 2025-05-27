const Product = require('../models/productSchema');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createProduct = async (req, res) => {
    let { name, description, price, category, mukhiCount, origin, size, color, images, stock, isBlessed, benefits } = req.body;

    if (!name || !description || !price || !category || !mukhiCount || !origin || !size || !color || !images || !stock || !benefits) {
        return res.json({ msg: "All fields are required", success: false });
    }
    try {
        let existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.json({ msg: "Product with this name already exists", success: false });
        }
        let product = await Product.create({
            name,
            description,
            price,
            category,
            mukhiCount,
            origin,
            size,
            color,
            images,
            stock,
            isBlessed: isBlessed || false,
            benefits
        });
        res.status(201).json({msg: "Product created successfully", success: true, product });
    } catch (error) {
        res.status(500).json({ msg: "Error in creating product", success: false, error: error.message });
    }
};


const getAllProducts = async (req, res) => {
    try {
        // Basic filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(e => delete queryObj[e]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        const products = await query;
        res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching products", success: false, error: error.message });
    }
};


const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({  msg: "Product not found",  success: false });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching product", success: false, error: error.message });
    }
};



const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({ msg: "Product not found", success: false });
        }
        
        res.status(200).json({ msg: "Product updated successfully", success: true, product });
    } catch (error) {
        res.status(500).json({ msg: "Error updating product", success: false, error: error.message });
    }
};


// const updateProduct = async (req, res) => {
//     const { id } = req.params; // Get product ID from URL params
//     const { name, description, price, category, mukhiCount, origin, size, color, images, stock, isBlessed, benefits } = req.body;

//     // Basic validation
//     if (!name || !description || !price || !category || !mukhiCount || !origin || !size || !color || !images || !stock || !benefits) {
//         return res.json({ msg: "All fields are required", success: false });
//     }

//     try {
//         // Check if product exists
//         const existingProduct = await Product.findById(id);
//         if (!existingProduct) {
//             return res.json({ msg: "Product not found", success: false });
//         }

//         // Check if another product already has the new name
//         const nameConflict = await Product.findOne({ 
//             name, 
//             _id: { $ne: id } // Exclude current product from the check
//         });
//         if (nameConflict) {
//             return res.json({ msg: "Another product with this name already exists", success: false });
//         }

//         // Update the product
//         const updatedProduct = await Product.findByIdAndUpdate(
//             id,
//             {
//                 name,
//                 description,
//                 price,
//                 category,
//                 mukhiCount,
//                 origin,
//                 size,
//                 color,
//                 images,
//                 stock,
//                 isBlessed: isBlessed || false,
//                 benefits
//             },
//             { new: true } // Return the updated document
//         );

//         res.status(200).json({
//             msg: "Product updated successfully",
//             success: true,
//             product: updatedProduct
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             msg: "Error in updating product", 
//             success: false, 
//             error: error.message 
//         });
//     }
// };

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: "Product not found", success: false });
        }
        res.status(200).json({ msg: "Product deleted successfully", success: true, product });

    } catch (error) {
        res.status(500).json({ msg: "Error deleting product", success: false, error: error.message });
    }
};


const getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });

        if (!products || products.length === 0) {
            return res.status(404).json({ msg: "No products found in this category", success: false });
        }

        res.status(200).json({ success: true, count: products.length, products });

    } catch (error) {
        res.status(500).json({ msg: "Error fetching products by category", success: false, error: error.message });
    }
};


const getProductsByMukhiCount = async (req, res) => {
    try {
        const count = parseInt(req.params.count);
        if (isNaN(count)) {
            return res.status(400).json({ msg: "Please provide a valid mukhi count", success: false });
        }
        const products = await Product.find({ mukhiCount: count });
        if (!products || products.length === 0) {
            return res.status(404).json({ msg: `No products found with ${count} mukhi`, success: false });
        }
        res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching products by mukhi count", success: false, error: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductsByMukhiCount
};