import AdminModel from '../models/Admin.js'
import AppError from "../errors/AppError.js"
import jwt from 'jsonwebtoken'

const makeJwt = (id, phone, role) => {
    return jwt.sign(
        {id, phone, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class AdminController {
    async signup(req, res, next) {
        const {phone, role = 'ADMIN'} = req.body
        try {
            if (!phone) {
                throw new Error('Пустой номер телефона')
            }
            if (role !== 'ADMIN') {
                throw new Error('Возможна только роль ADMIN')
            }
            const admin = await AdminModel.create({phone, role})
            const token = makeJwt(admin.id, admin.phone, admin.role)
            return res.json({token})
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async login(req, res, next) {
        try {
            const {phone} = req.body
            const admin = await AdminModel.getByPhone(phone)
            const token = makeJwt(admin.id, admin.phone, admin.role)
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
            const admins = await AdminModel.getAll()
            res.json(admins)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const admin = await AdminModel.getOne(req.params.id)
            res.json(admin)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const admin = await AdminModel.delete(req.params.id)
            res.json(admin)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new AdminController()