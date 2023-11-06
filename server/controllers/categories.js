
const logger = require('../logger');
const Category = require('../models/Category');

exports.getAllCategories = (req, res) => {
    Category.find()
        .then((categories) => {
        res.json({ success: true, categories });
        })
        .catch((error) => {
        logger.error('Error fetching categories: ', error);
        res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
        });
    }

exports.createCategory = (req, res) => {
    const { name, slug,description ,icon} = req.body;

    const newCategory = new Category({ name,slug, description, icon });
    newCategory
        .save()
        .then((category) => {
        res.json({ success: true, message: 'Category created', category });
        })
        .catch((error) => {
        logger.error('Error creating category: ', error);
        res.status(500).json({ success: false, message: 'Error creating category', error: error.message });
        });
    }

exports.getCategoryById = (req, res) => {
    const categoryId = req.params.id;

    Category.findById(categoryId)
        .then((category) => {
        if (!category) {
            res.status(404).json({ success: false, message: 'Category not found' });
        } else {
            res.json({ success: true, category });
        }
        })
        .catch((error) => {
        logger.error('Error fetching category: ', error);
        res.status(500).json({ success: false, message: 'Error fetching category', error: error.message });
        });
    }

exports.updateCategory = (req, res) => {
const categoryId = req.params.id;
console.log("categoryId",categoryId)

Category.updateOne({ _id: categoryId }, req.body)
    .then((result) => {
        console.log("result",result)
    if (result.modifiedCount > 0) {
        res.json({ success: true, message: 'Category updated' });
    } else {
        res.status(404).json({ success: false, message: 'Category not found' });
    }
    })
    .catch((error) => {
    logger.error('Error updating category: ', error);
    res.status(500).json({ success: false, message: 'Error updating category', error: error.message });
    });


}

exports.deleteCategory = (req, res) => {
    const categoryId = req.params.id;

    Category.findByIdAndRemove(categoryId)
        .then((category) => {
        if (!category) {
            res.status(404).json({ success: false, message: 'Category not found' });
        } else {
            res.json({ success: true, message: 'Category deleted' });
        }
        })
        .catch((error) => {
        logger.error('Error deleting category: ', error);
        res.status(500).json({ success: false, message: 'Error deleting category', error: error.message });
        });
    }