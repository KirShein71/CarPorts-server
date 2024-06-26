import ProjectBrigadesModel from '../models/ProjectBrigades.js'
import AppError from '../errors/AppError.js'


class ProjectbrigadesController {
    async getAll(req, res, next) {
        try {
            const projectbrigades = await ProjectBrigadesModel.getAll()
            res.json(projectbrigades)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const projectbrigades = await ProjectBrigadesModel.getOne(req.params.id)
            res.json(projectbrigades)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
   

    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const projectbrigades = await ProjectBrigadesModel.create( req.body)
            res.json(projectbrigades)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createPlanStart(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const projectbrigades = await ProjectBrigadesModel.createPlanStart(req.params.id, req.body,)
            res.json(projectbrigades)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createPlanFinish(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const projectbrigades = await ProjectBrigadesModel.createPlanFinish(req.params.id, req.body,)
            res.json(projectbrigades)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateBrigade(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const projectbrigades = await ProjectBrigadesModel.updateBrigade(req.params.id, req.body,)
            res.json(projectbrigades)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const projectbrigades = await ProjectBrigadesModel.delete(req.params.id)
            res.json(projectbrigades)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

  
}

export default new ProjectbrigadesController()