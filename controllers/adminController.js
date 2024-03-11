import AdminModel from '../models/Admin.js'
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

class AdminController {
    async signup(req, res, next) {
        const {phone, password, role = 'ADMIN'} = req.body
        try {
            if (!phone || !password) {
                throw new Error('Пустой номер телефона или пароль')
            }
            if (role !== 'ADMIN') {
                throw new Error('Возможна только роль ADMIN')
            }
            const hash = await bcrypt.hash(password, 10)
            const admin = await AdminModel.create({phone, password: hash, role})
            const token = makeJwt(admin.id, admin.phone, admin.role)
            return res.json({token})
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async login(req, res, next) {
        try {
            const {phone, password} = req.body
            const admin = await AdminModel.getByPhone(phone)
            let compare = bcrypt.compareSync(password, admin.password)
            if (!compare) {
                throw new Error('Указан неверный пароль')
            }
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