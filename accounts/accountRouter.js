const express = require('express');
const db = require("../data/dbConfig.js");
const router = express.Router()

// helpers
const Accounts = {
    getAll() {
        return db('accounts')
    },

    getById(id) {
        return db('accounts').where({id: id}).first()
    },

    create(account) {
        return db('accounts').insert(account)
    },

    update(id, account) {
        return db('accounts').where({id: id}).update(account)
    },

    delete(id) {
        return db('accounts').where({id:id}).del()
    }
}

//end helpers

router.get('/', (req, res)=>{
    Accounts.getAll()
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        res.status(404).json({message: error.message })
    })
})

router.get('/:id', (req, res)=> {
    Accounts.getById(req.params.id)
    .then(account => {
        if (account){
            res.status(200).json(account)
        } else {
            res.status(400).json({message: 'cannot find with that id'})
        }
    })
    .catch(error => {
        res.status(500).json({message: error.message })
    })
})


router.post("/", (req, res) => {
    Accounts.create(req.body)
    .then(([id]) => {
        return Accounts.getById(id).first()
    })
    .then(newAccount => {
        res.status(200).json(newAccount)
    })
    .catch(error => {
        res.status(500).json({message: error.message })
    })
})

router.put('/:id', (req, res) => {
    Accounts.update(req.params.id, req.body)
    .then(count => {
        if (!count){
            res.json({message: 'no post with that id'})
        } else {
            return Accounts.getById(req.params.id).first()
        }
    })
    .then(updatedAccount => {
        res.status(200).json(updatedAccount)
    })
    .catch(error => {
        res.status(500).json({message: error.message })
    })
})

router.delete('/:id', (req, res) => {
    Accounts.delete(req.params.id)
    .then(() => {
        res.status(200).json({message: 'account was deleted'})
    })
    .catch(error => {
        res.status(500).json({message: error.message })
    })
})

module.exports = router