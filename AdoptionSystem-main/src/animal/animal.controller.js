'use strict'

import Animal from './animal.model.js'


// Registro Animal
export const registerA = async(req, res) => {
    try {
        let data = req.body
        let animal = new Animal(data)
        await animal.save()
        return animal.send({ message: `Registered successfully ${animal.name}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering animal', err: err })
    }
}


/*
export const updateA = async(req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated'})
        let updatedUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            {new: true}
        )

        if (!updatedUser) return res.status(401).send({ message: 'User not found update' })
        return res.send({ message: 'User update', updatedUser })
    } catch (err) {
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is alredy taken`})
        return res.status(500).send({ message: 'Error updating account' })
    }
}

export const deleteU = async (req, res) => {
    try {
        let { id } = req.params
        let deleteUser = await User.findOneAndDelete({_id: id})
        if(!deleteUser) return res.status(404).send({message: 'Account not found anda not deleted'})        
        return res.send({message: `Account with username ${deleteUser.username} deleted succesfully`})//status 200
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}
*/