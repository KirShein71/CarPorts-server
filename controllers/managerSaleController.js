import ManagerSaleModel from "../models/ManagerSale.js"
import AppError from "../errors/AppError.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const makeJwt = (id, phone, role) => {
    return jwt.sign(
        {id, phone, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class ManagerSaleController {
    async signup(req, res, next) {
        const {phone, password, role = 'ManagerSale', name} = req.body
        try {
            if (!phone || !password) {
                throw new Error('Пустой номер телефона или пароль')
            }
            if (role !== 'ManagerSale') {
                throw new Error('Вход только для сотрудников')
            }
            const hash = await bcrypt.hash(password, 10)
            const manager = await ManagerSaleModel.create({phone, password: hash, role, name})
            const token = makeJwt(manager.id, manager.phone, manager.role, manager.name, manager)
            return res.json({token})
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async login(req, res, next) {
        try {
            const {phone, password} = req.body
            const manager = await ManagerSaleModel.getByPhone(phone)
            let compare = bcrypt.compareSync(password, manager.password)
            if (!compare) {
                throw new Error('Указан неверный пароль')
            }
            const token = makeJwt(manager.id, manager.phone, manager.role)
            return res.json({token})
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async check(req, res, next) {
        const token = makeJwt(req.auth.id, req.auth.phone, req.auth.role)
        return res.json({token})
    }

    async getAll(req, res, next) {
        try {
            const manager = await ManagerSaleModel.getAll()
            res.json(manager)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const manager = await ManagerSaleModel.getOne(req.params.id)
            res.json(manager)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }



    async create(req, res, next) {
        const {phone, password, name, role = 'ManagerSale'} = req.body
        try {
            if (!phone || !password) {
                throw new Error('Пустой номер телефона')
            }
            if ( ! ['ManagerSale'].includes(role)) {
                throw new Error('Недопустимое значение роли')
            }
            const hash = await bcrypt.hash(password, 10)
            const manager = await ManagerSaleModel.create({phone, password: hash, role, name})
            return res.json(manager)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updatePassword(req, res, next) {
        const {password} = req.body
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
           
            const hash = await bcrypt.hash(password, 10)
            const manager = await ManagerSaleModel.updatePassword(req.params.id, { password: hash})
            res.json(manager)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const manager = await ManagerSaleModel.delete(req.params.id)
            res.json(manager)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}


export default new ManagerSaleController()