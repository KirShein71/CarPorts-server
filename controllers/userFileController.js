import UserFileModel from '../models/UserFile.js'
import AppError from '../errors/AppError.js'

class UserFileController {
    async getAll(req, res, next) {
        try {
            const userfiles = await UserFileModel.getAll()
            res.json(userfiles)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllByUserId(req, res, next) {
        try {
            const userfiles = await UserFileModel.getAllByUserId(req.params.id);
            res.json(userfiles);
        } catch(e) {
            next(AppError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const userfile = await UserFileModel.getOne(req.params.id)
            res.json(userfile)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const userfile = await UserFileModel.create(req.body, req.files.file)
            res.json(userfile)
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
            const brfile = await UserFileModel.update(req.params.id, req.body, req.files.file)
            res.json(brfile)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    
    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const userfile = await UserFileModel.delete(req.params.id)
            res.json(userfile)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new UserFileController()