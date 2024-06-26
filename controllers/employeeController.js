import EmployeeModel from '../models/Employee.js'
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

class EmployeeController {
    async signup(req, res, next) {
        const {phone, password, role, name, speciality = 'EMPLOYEE'} = req.body
        try {
            if (!phone || !password) {
                throw new Error('Пустой номер телефона или пароль')
            }
            if (role !== 'EMPLOYEE') {
                throw new Error('Вход только для сотрудников')
            }
            const hash = await bcrypt.hash(password, 10)
            const employee = await EmployeeModel.create({phone, password: hash, role, name, speciality})
            const token = makeJwt(employee.id, employee.phone, employee.role, employee.name, employee.speciality)
            return res.json({token})
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async login(req, res, next) {
        try {
            const {phone, password} = req.body
            const employee = await EmployeeModel.getByPhone(phone)
            let compare = bcrypt.compareSync(password, employee.password)
            if (!compare) {
                throw new Error('Указан неверный пароль')
            }
            const token = makeJwt(employee.id, employee.phone, employee.role)
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
            const employees = await EmployeeModel.getAll()
            res.json(employees)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const employee = await EmployeeModel.getOne(req.params.id)
            res.json(employee)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getManager(req, res, next) {
        try {
            const employee = await EmployeeModel.getManager(req.params.id);
            res.json(employee);
        } catch(e) {
            next(AppError.badRequest(e.message));
        }
    }

    async create(req, res, next) {
        const {phone, password, speciality, name, role = 'EMPLOYEE'} = req.body
        try {
            if (!phone || !password) {
                throw new Error('Пустой номер телефона')
            }
            if ( ! ['EMPLOYEE'].includes(role)) {
                throw new Error('Недопустимое значение роли')
            }
            const hash = await bcrypt.hash(password, 10)
            const employee = await EmployeeModel.create({phone, password: hash, role, name, speciality})
            return res.json(employee)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const employee = await EmployeeModel.delete(req.params.id)
            res.json(employee)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}


export default new EmployeeController()