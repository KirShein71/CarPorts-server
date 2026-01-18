import NpsQuestionModel  from '../models/NpsQuestion.js'
import AppError from '../errors/AppError.js'

class NpsQuestionController {
    async getAll(req, res, next) {
        try {
            const nps_question = await NpsQuestionModel.getAll()
            res.json(nps_question)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id вопроса')
            }
            const nps_question = await NpsQuestionModel.getOne(req.params.id)
            res.json(nps_question)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const nps_question = await NpsQuestionModel.create(req.body)
            res.json(nps_question)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateName(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id вопроса')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const nps_question = await NpsQuestionModel.updateName(req.params.id, req.body,)
            res.json(nps_question)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateChapter(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id вопроса')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const nps_question = await NpsQuestionModel.updateChapter(req.params.id, req.body,)
            res.json(nps_question)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    
    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id вопроса')
            }
            const nps_question = await NpsQuestionModel.delete(req.params.id)
            res.json(nps_question)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new NpsQuestionController()