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

router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
        res.render('items/show', { item: item })
    } catch (error) {
        res.redirect('/')        
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
        res.render('items/edit', { item: item })
    } catch (error) {
        res.redirect('items')
    }
})

router.post('/', async (req, res) => {
    const item = new Item({
        name: req.body.name,
        siteUrl: req.body.siteUrl,
        githubUrl: req.body.githubUrl,
        youtubeUrl: req.body.youtubeUrl,
        // tags: req.body.tags
    })
    try {
        const newItem = await item.save()
        res.redirect(`items/${newItem.id}`)
    } catch (error) {
        res.render('items/new', {
            item: item,
            errorMessage: 'Error creating Item'
        })
    }
})

router.put('/:id', async (req, res) => {
    let item
    try {
        item = await Item.findById(req.params.id)
        item.name = req.body.name
        item.siteUrl = req.body.siteUrl
        item.githubUrl = req.body.githubUrl
        item.youtubeUrl = req.body.youtubeUrl
        await item.save()
        res.redirect(`items/${item.id}`)
    } catch (error) {
        if (item == null) {
            res.redirect('/')
        } else {
            res.render('items/edit', {
                item: item,
                errorMessage: 'Error updating Item'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let item
    try {
        item = await Item.findById(req.params.id)
        await item.deleteOne()
        res.redirect('items')
    } catch (error) {
        if (item == null) {
            res.redirect('/')
        } else {
            res.redirect(`items/${item.id}`)
        }
    }
})

module.exports = router