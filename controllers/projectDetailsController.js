import ProjectDetailsModel from '../models/ProjectDetails.js'
import AppError from '../errors/AppError.js'


class ProjectDetailsController {
    async getAll(req, res, next) {
        try {
            const projectdetails = await ProjectDetailsModel.getAll()
            res.json(projectdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const projectDetails = await ProjectDetailsModel.getOne(req.params.id)
            res.json(projectDetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
   

    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const projectdetails = await ProjectDetailsModel.create( req.body)
            res.json(projectdetails)
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
            const projectdetails = await ProjectDetailsModel.update(req.params.id, req.body,)
            res.json(projectdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.projectId) {
                throw new Error('Не найдена отметка времени')
            }
            const projectdetails = await ProjectDetailsModel.delete(req.params.projectId)
            res.json(projectdetails)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

  
}

export default new ProjectDetailsController()