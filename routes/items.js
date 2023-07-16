const express = require('express')
const router = express.Router()
const Item = require('../models/item')

router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name != '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const items = await Item.find(searchOptions)
        res.render('items/index', {
            items: items,
            searchOptions: req.query
        })
    } catch (error) {
        res.redirect('/')   
    }
    
})

router.get('/new', (req, res) => { 
    res.render('items/new', { item: new Item() })
})

router.post('/', async (req, res) => {
    const item = new Item({
        name: req.body.name,
        siteUrl: req.body.siteUrl,
        githubUrl: req.body.githubUrl,
        youtubeUrl: req.body.youtubeUrl,
        tags: req.body.tags
    })
    try {
        const newItem = await item.save()
        // res.redirect(`items/${newItem.id}`)
    } catch (error) {
        res.render('items/new', {
            item: item,
            errorMessage: 'Error creating Item'
        })
    }
})

module.exports = router