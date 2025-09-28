import UserModel from '../models/User.js'
import ProjectModel from '../models/Project.js'
import AppError from "../errors/AppError.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const makeJwt = (id, phone, role) => {
    return jwt.sign(
        {id, phone, role},
        process.env.SECRET_KEY,
        {expiresIn: '120h'}
    )
}

class UserController {
    async signup(req, res, next) {
        const {phone, password, role = 'USER'} = req.body
        try {
            if (!phone || !password) {
                throw new Error('Пустой номер телефона или пароль')
            }
            if (role !== 'USER') {
                throw new Error('Вход только для клиентов')
            }
            const hash = await bcrypt.hash(password, 10)
            const user = await UserModel.create({phone, password: hash, role})
            const token = makeJwt(user.id, user.phone, user.role)
            return res.json({token})
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async login(req, res, next) {
        try {
            const {phone, password} = req.body
            const user = await UserModel.getByPhone(phone)
            let compare = bcrypt.compareSync(password, user.password)
            if (!compare) {
                throw new Error('Указан неверный пароль')
            }
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
    async getOneAccountByToken(req, res, next) {
        try {
            const token = req.params.token;
            if (!token) {
                throw new Error('Не указан токен');
            }
            
            const user = await UserModel.getOneAccountByToken(token);
            res.json(user);
        } catch(e) {
            next(AppError.badRequest(e.message));
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

    async getUserForBrigade(req, res, next) {
        try {
            if (!req.params.projectId) {
                throw new Error('Не указан id пользователя')
            }
            
            const user = await UserModel.getUserForBrigade(req.params.projectId)
            res.json(user)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        const {phone, password, projectId, role = 'USER'} = req.body
        try {
            if (!phone || !password) {
                throw new Error('Пустой номер телефона или пароль')
            }
            if ( ! ['USER'].includes(role)) {
                throw new Error('Недопустимое значение роли')
            }
            const hash = await bcrypt.hash(password, 10)
            const user = await ProjectModel.create({phone, password: hash, projectId, role})
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

    async createMainImage(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const user = await UserModel.createMainImage(req.params.id, req.body, req.files.image)
            res.json(user)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updatePhone(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const user = await UserModel.updatePhone(req.params.id, req.body,)
            res.json(user)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updatePassword(req, res, next) {
        const {password} = req.body
        try {
            if (!req.params.id) {
                throw new Error('Не указан id клиента')
            }
           
            const hash = await bcrypt.hash(password, 10)
            const user = await UserModel.updatePassword(req.params.id, { password: hash})
            res.json(user)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async generationUrlForClientAccount(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const user = await UserModel.generationUrlForClientAccount(req.params.id)
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