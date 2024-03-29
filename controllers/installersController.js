import InstallerModel from '../models/Installer.js'
import  BrigadeModel  from '../models/Installer.js'
import AppError from '../errors/AppError.js'

class InstallersController {
    async getAll(req, res, next) {
        try {
            const installers = await InstallerModel.getAll()
            res.json(installers)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const installer = await InstallerModel.getOne(req.params.id)
            res.json(installer)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const installer = await BrigadeModel.create(req.body)
            res.json(installer)
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
            const installer = await InstallerModel.update(req.params.id, req.body,)
            res.json(installer)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const installer = await InstallerModel.delete(req.params.id)
            res.json(installer)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new InstallersController()