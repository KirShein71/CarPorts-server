import ControlTourModel from '../models/ControlTour.js'
import AppError from '../errors/AppError.js'


class controlTourController {
    async getAll(req, res, next) {
        try {
            const control_tour = await ControlTourModel.getAll()
            res.json(control_tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getDaysSetForProjects(req, res, next) {
        try {
            const control_tour = await ControlTourModel.getDaysSetForProjects()
            res.json(control_tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

   
    async getAllCertainDays(req, res, next) {
        try {
            const control_tour = await ControlTourModel.getAllCertainDays()
            res.json(control_tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const control_tour = await ControlTourModel.getOne(req.params.id)
            res.json(control_tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

 
   

    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const control_tour = await ControlTourModel.create( req.body)
            res.json(control_tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    

    async updateControlTour(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const control_tour = await ControlTourModel.updateControlTour(req.params.id, req.body,)
            res.json(control_tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async refreshDataControlTour(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const control_tour  = await ControlTourModel.refreshDataControlTour(req.params.id, req.body,)
            res.json(control_tour )
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const control_tour = await ControlTourModel.delete(req.params.id)
            res.json(control_tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    } 

   
    async getAllNumberOfDaysControlTour(req, res, next) {
        try {
            
            const setId = req.params.setId
            const projectId = req.params.projectId

            const control_tour = await ControlTourModel.getAllNumberOfDaysControlTour(setId, projectId)
            res.json(control_tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllNumberOfDaysControlTourForRegion(req, res, next) {
        try {
            const control_tour = await ControlTourModel.getAllNumberOfDaysControlTourForRegion()
            res.json(control_tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllNumberOfDaysSetForProject(req, res, next) {
        try {
            
            const setId = req.params.setId
         
            const control_tour = await BrigadesDateModel.getAllNumberOfDaysSetForProject(setId)
            res.json(control_tour)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
  

    
    
}

export default new controlTourController()