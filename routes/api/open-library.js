const routes = require('express').Router();
const axios = require('axios');
const isEmpty = require('lodash/isEmpty');

// Get book by ISBN
routes.get('/book/:isbn', async (req, res) => {
    try {
        const response = await axios.get(`https://openlibrary.org/isbn/${req.params.isbn}`)
        res.json(response)
    } catch (error) {
        res.status(404).send(error.message)
    }
})

// Get book suggestions by title or author for search bar (to get to the book presentation page)
routes.get('/', async (req, res) => {
    const listLimit = (req.query.limit > 10 ? 3 : req.query.limit) || 3
    const dataToSend = []

    try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${req.query.search_query}`)
        console.log(req.query.search_query);
        if (isEmpty(response.data.docs)) {
            return res.status(404).json({message: "No books were found."})
        } else {
            for (let i = 0; i < listLimit; i++) {
                const book = response.data.docs[i]
                // TODO: Add book presentation page link
                dataToSend.push({
                    title: book.title_suggest,
                    author: book.author_name,
                    publishYear: book.first_publish_year
                })
            }
    
            res.status(response.status).json(dataToSend)
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

// TODO: Get data for author page

module.exports = routes