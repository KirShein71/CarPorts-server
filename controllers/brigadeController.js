import BrigadeModel from '../models/Brigade.js'
import AppError from '../errors/AppError.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const makeJwt = (id, phone, role) => {
    return jwt.sign(
        {id, phone, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class BrigadeController {
    async signup(req, res, next) {
        const {name, phone, regionId, role  = 'INSTALLER', password} = req.body
        try {
            if (!phone || !password) {
                throw new Error('Пустой номер телефона или пароль')
            }
            if (role !== 'INSTALLER') {
                throw new Error('Вход только для сотрудников')
            }
            const hash = await bcrypt.hash(password, 10)
            const brigade = await BrigadeModel.create({name, phone, regionId, role, password: hash })
            const token = makeJwt(brigade.id, brigade.name, brigade.phone, brigade.regionId, brigade.role)
            return res.json({token})
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async login(req, res, next) {
        try {
            const {phone, password} = req.body
            const brigade = await BrigadeModel.getByPhone(phone)
            let compare = bcrypt.compareSync(password, brigade.password)
            if (!compare) {
                throw new Error('Указан неверный пароль')
            }
            const token = makeJwt(brigade.id, brigade.phone, brigade.role)
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
            const brigades = await BrigadeModel.getAll()
            res.json(brigades)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const brigade = await BrigadeModel.getOne(req.params.id)
            res.json(brigade)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        const {name, phone, regionId, active, role  = 'INSTALLER', password} = req.body
        try {
            if (!phone || !password) {
                throw new Error('Пустой номер телефона')
            }
            if ( ! ['INSTALLER'].includes(role)) {
                throw new Error('Недопустимое значение роли')
            }
            const hash = await bcrypt.hash(password, 10)
            const brigade = await BrigadeModel.create({phone, password: hash, role, name, regionId, active})
            return res.json(brigade)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    

    async createRegion(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const brigade = await BrigadeModel.createRegion(req.params.id, req.body,)
            res.json(brigade)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createPassword(req, res, next) {
        const {password} = req.body
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
           
            const hash = await bcrypt.hash(password, 10)
            const brigade = await BrigadeModel.createPassword(req.params.id, { password: hash})
            res.json(brigade)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const bragade = await BrigadeModel.update(req.params.id, req.body, req.files.image)
            res.json(bragade)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateActiveBrigade(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const bragade = await BrigadeModel.updateActiveBrigade(req.params.id, req.body)
            res.json(bragade)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateBrigadeName(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const bragade = await BrigadeModel.updateBrigadeName(req.params.id, req.body)
            res.json(bragade)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateBrigadePhone(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const bragade = await BrigadeModel.updateBrigadePhone(req.params.id, req.body)
            res.json(bragade)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    
    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const brigade = await BrigadeModel.delete(req.params.id)
            res.json(brigade)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new BrigadeController()