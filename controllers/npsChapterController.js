import NpsChapterModel from '../models/NpsChapter.js'
import AppError from '../errors/AppError.js'

class NpsChapterController {
    async getAll(req, res, next) {
        try {
            const nps_chapter = await NpsChapterModel.getAll()
            res.json(nps_chapter)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id раздела')
            }
            const nps_chapter = await NpsChapterModel.getOne(req.params.id)
            res.json(nps_chapter)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const nps_chapter = await NpsChapterModel.create(req.body)
            res.json(nps_chapter)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateName(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id раздела')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const nps_chapter = await NpsChapterModel.updateName(req.params.id, req.body,)
            res.json(nps_chapter)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateNumber(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id раздела')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const nps_chapter = await NpsChapterModel.updateNumber(req.params.id, req.body,)
            res.json(nps_chapter)
            
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id раздела')
            }
            const nps_chapter = await NpsChapterModel.delete(req.params.id)
            res.json(nps_chapter)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new NpsChapterController()