'use strict' //Modo estricto
//npm i 
// npm i dev -D
// npm run dev
import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const register = async(req, res) => {
    try {
        //Capturar el formulario (body)
        let data = req.body

        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto
        data.role = 'CLIENT'
        //Guardar la información en la BD
        let user = new User(data)
        await user.save()
        //Responder al usuario
        return res.send({ message: `Registered successfully, can be logged with email username ${user.name}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}

export const login = async (req, res) => {
    try {
        //Capturar los datos(body)
        let { username, password } = req.body
        //Validar que el usuario exista
        let user = await User.findOne({ username }) // buscar un solo registro
        //Verifico que la constrasena coincida
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                username: user.username,
                name: user.name,
                role: user.role
            }
            //Responde el usuario
            return res.send({ message: `Welcome pero no mucho rato :) ${loggedUser.name}`, loggedUser })
        }


        return res.status(404).send({ message: `Invalid credentials` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }
}

export const update = async(req, res) => {
    try {
        //Obtener el id del usuario para actualizar
        let { id } = req.params
        //Obtener los datos actualizados
        let data = req.body
        //Validar si data trae datos
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated'})
        //Validar si tiene permisos (tokenizacion)
        //Actualizar
        let updatedUser = await User.findOneAndUpdate(
            { _id: id },//ObjectId <- hexadecimalews (Hora sys, version Mongo, llave privada...)
            data,//Los datos que se van a actualizar
            {new: true}
        )

        //Validar la actualización
        if (!updatedUser) return res.status(401).send({ message: 'User not found update' })
        //Responder al usuario
        return res.send({ message: 'User update', updatedUser })
    } catch (err) {
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is alredy taken`})
        return res.status(500).send({ message: 'Error updating account' })
    }
}

export const deleteU = async (req, res) => {
    try {
        //Obtener el id
        let { id } = req.params
        //Validar si esta logeado y es el mismo X no lo vemos hoy X
        //Eliminar (deleteOne/findOneAndDelete)
        let deleteUser = await User.findOneAndDelete({_id: id})
        //Verificar si se elimino
        if(!deleteUser) return res.status(404).send({message: 'Account not found anda not deleted'})        
        //Responder
        return res.send({message: `Account with username ${deleteUser.username} deleted succesfully`})//status 200
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}