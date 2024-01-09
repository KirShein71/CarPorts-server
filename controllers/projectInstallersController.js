import ProjectInstallersModel from '../models/ProjectInstallers.js'
import AppError from '../errors/AppError.js'


class ProjectInstallersController {
    async getAll(req, res, next) {
        try {
            const projectinstallers = await ProjectInstallersModel.getAll()
            res.json(projectinstallers)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const projectinstallers = await ProjectInstallersModel.getOne(req.params.id)
            res.json(projectinstallers)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
   

    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const projectinstallers = await ProjectInstallersModel.create( req.body)
            res.json(projectinstallers)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

  
}

export default new ProjectInstallersController()