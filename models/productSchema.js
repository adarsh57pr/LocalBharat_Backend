const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price must be at least 0']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: {
            values: [
                '1 Mukhi',
                '5 Mukhi',
                '7 Mukhi',
                '14 Mukhi',
                 'Other'
            ],
            message: 'Please select a valid category'
        }
    },
    mukhiCount: {
        type: Number,
        required: [true, 'Mukhi count is required'],
        min: [1, 'Mukhi count must be at least 1'],
        max: [21, 'Mukhi count cannot exceed 21']
    },
    origin: {
        type: String,
        required: [true, 'Origin is required'],
        enum: {
            values: ['Nepal', 'Java', 'Indonesia', 'India', 'Other'],
            message: 'Please select a valid origin'
        }
    },
    size: {
        type: String,
        required: [true, 'Size is required'],
        match: [/^\d+mm$/, 'Size must be in format like "12mm"']
    },
    color: {
        type: String,
        required: [true, 'Color is required'],
        enum: {
            values: ['Brown', 'Reddish Brown', 'Dark Brown', 'Black', 'Mixed'],
            message: 'Please select a valid color'
        }
    },
    images: {
        type: [String],
        required: [true, 'At least one image is required'],
        validate: {
            validator: function (images) {
                return images.length > 0;
            },
            message: 'At least one image is required'
        }
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative']
    },
    isBlessed: {
        type: Boolean,
        default: false
    },
    benefits: {
        type: String,
        required: [true, 'Spiritual benefits description is required']
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating cannot exceed 5']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
productSchema.index({
    name: 'text',
    description: 'text',
    category: 'text',
    benefits: 'text'
});

productSchema.virtual('formattedPrice').get(function () {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(this.price);
});

productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('product', productSchema);
