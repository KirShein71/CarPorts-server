import BrigadesDateModel from '../models/BrigadesDate.js'
import AppError from '../errors/AppError.js'


class BrigadesDateController {
    async getAll(req, res, next) {
        try {
            const brigadesdate = await BrigadesDateModel.getAll()
            res.json(brigadesdate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getDaysInstallerForProjects(req, res, next) {
        try {
            const brigadesdate = await BrigadesDateModel.getDaysInstallerForProjects()
            res.json(brigadesdate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllForOneBrigade(req, res, next) {
        try {
            const brigadesdate = await BrigadesDateModel.getAllForOneBrigade(req.params.brigadeId)
            res.json(brigadesdate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllCertainDays(req, res, next) {
        try {
            const brigadesdate = await BrigadesDateModel.getAllCertainDays()
            res.json(brigadesdate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const brigadesdate = await BrigadesDateModel.getOne(req.params.id)
            res.json(brigadesdate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

 
   

    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const brigadesdate = await BrigadesDateModel.create( req.body)
            res.json(brigadesdate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    

    async updateBrigadesDate(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const brigadesdate = await BrigadesDateModel.updateBrigadesDate(req.params.id, req.body,)
            res.json(brigadesdate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async refreshDataBrigadesDate(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const brigadesdate  = await BrigadesDateModel.refreshDataBrigadesDate(req.params.id, req.body,)
            res.json(brigadesdate )
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const brigadesdate = await BrigadesDateModel.delete(req.params.id)
            res.json(brigadesdate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    } 

    async getAllDate(req, res, next) {
        try {
            const date = await BrigadesDateModel.getAllDate()
            res.json(date)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }


    async getAllNumberOfDaysBrigade(req, res, next) {
        try {
            
            const brigadeId = req.params.brigadeId
            const projectId = req.params.projectId

            const brigadesdate = await BrigadesDateModel.getAllNumberOfDaysBrigade(brigadeId, projectId)
            res.json(brigadesdate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllNumberOfDaysBrigadeForProject(req, res, next) {
        try {
            
            const brigadeId = req.params.brigadeId
         

            const brigadesdate = await BrigadesDateModel.getAllNumberOfDaysBrigadeForProject(brigadeId)
            res.json(brigadesdate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllNumberOfDaysBrigadeForRegion(req, res, next) {
        try {
            const brigadesdate = await BrigadesDateModel.getDataInstallerWorksForRegion()
            res.json(brigadesdate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
  

    
    
}

export default new BrigadesDateController()