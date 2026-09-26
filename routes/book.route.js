const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Book = require('../models/book.model')

// GET all books
router.get('/', async (req, res) => {
    try {
        const {
            search,
            category,
            page = 1,
            limit = 10
        } = req.query;

        let query = {};

        // Escape regex special characters to avoid crashes/injection
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        if (search) {
            const safeSearch = escapeRegex(search.trim());
            query.$or = [
                { title: { $regex: safeSearch, $options: "i" } },
                { author: { $regex: safeSearch, $options: "i" } }
            ];
        }

        if (category) {
            query.category = category;
        }

        // Sanitize page/limit — fallback to safe defaults, enforce minimums
        const safePage = Math.max(Number(page) || 1, 1);
        const safeLimit = Math.max(Number(limit) || 10, 1);

        const options = {
            page: safePage,
            limit: safeLimit,
            sort: { _id: -1 }
        };

        const allBooks = await Book.paginate(query, options);

        res.status(200).json(allBooks);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET single book
router.get('/:id', async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid book ID'
            })
        }

        const singleBook = await Book.findById(req.params.id)

        if (!singleBook) {
            return res.status(404).json({
                message: 'Book not found'
            })
        }

        res.status(200).json(singleBook)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

// ADD book
router.post('/', async (req, res) => {
    try {

        const newBook = await Book.create(req.body)

        res.status(201).json(newBook)

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// UPDATE book
router.put('/:id', async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid book ID'
            })
        }

        const updateBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )

        if (!updateBook) {
            return res.status(404).json({
                message: 'Book not found'
            })
        }

        res.status(200).json(updateBook)

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// DELETE book
router.delete('/:id', async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid book ID'
            })
        }

        const deleteBook = await Book.findByIdAndDelete(req.params.id)

        if (!deleteBook) {
            return res.status(404).json({
                message: 'Book not found'
            })
        }

        res.status(200).json({
            message: 'Book deleted successfully'
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router