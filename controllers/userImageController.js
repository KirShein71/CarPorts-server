import UserImageModel from '../models/UserImage.js'
import AppError from '../errors/AppError.js'

class UserImageController {
    async getAll(req, res, next) {
        try {
            const userimages = await UserImageModel.getAll()
            res.json(userimages)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllByUserId(req, res, next) {
        try {
            const userimages = await UserImageModel.getAllByUserId(req.params.id);
            res.json(userimages);
        } catch(e) {
            next(AppError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const userimage = await UserImageModel.getOne(req.params.id)
            res.json(userimage)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const userimage = await UserImageModel.create(req.body, req.files.image)
            console.log(req.files.image)
            res.json(userimage)
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
            const image = await UserImageModel.update(req.params.id, req.body, req.files.image)
            res.json(image)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    
    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const userimage = await UserImageModel.delete(req.params.id)
            res.json(userimage)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new UserImageController()