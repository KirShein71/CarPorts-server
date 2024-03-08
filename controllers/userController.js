import UserModel from '../models/User.js'
import AppError from "../errors/AppError.js"
import jwt from 'jsonwebtoken'

const makeJwt = (id, phone, role) => {
    return jwt.sign(
        {id, phone, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async signup(req, res, next) {
        const {phone, role = 'USER'} = req.body
        try {
            if (!phone) {
                throw new Error('Пустой номер телефона')
            }
            if (role !== 'USER') {
                throw new Error('Возможна только роль USER')
            }
            const user = await UserModel.create({phone, role})
            const token = makeJwt(user.id, user.phone, user.role)
            return res.json({token})
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async login(req, res, next) {
        try {
            const {phone} = req.body
            const user = await UserModel.getByPhone(phone)
            
            const token = makeJwt(user.id, user.phone, user.role, user.projectId)
            return res.json({token})
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOneAccount(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const user = await UserModel.getOneAccount(req.params.id)
            res.json(user)
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
            const users = await UserModel.getAll()
            res.json(users)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const user = await UserModel.getOne(req.params.id)
            res.json(user)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        const {phone, projectId, role = 'USER'} = req.body
        try {
            if (!phone) {
                throw new Error('Пустой номер телефона')
            }
            if ( ! ['USER'].includes(role)) {
                throw new Error('Недопустимое значение роли')
            }
            const user = await UserModel.create({phone, projectId, role})
            return res.json(user)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createManager(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const user = await UserModel.createManager(req.params.id, req.body,)
            res.json(user)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createBrigade(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const user = await UserModel.createBrigade(req.params.id, req.body,)
            res.json(user)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const user = await UserModel.delete(req.params.id)
            res.json(user)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}


export default new UserController()