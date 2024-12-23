import EstimateModel from '../models/Estimate.js'
import AppError from '../errors/AppError.js'


class estimateController {
    async getAll(req, res, next) {
        try {
            const estimate = await EstimateModel.getAll()
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllEstimatesForAllProjects(req, res, next) {
        try {
            const estimate = await EstimateModel.getAllEstimatesForAllProjects()
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllEstimateForBrigade(req, res, next) {
        try {
            const estimate = await EstimateModel.getAllEstimateForBrigade(req.params.id)
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllEstimateForBrigadeFinishProject(req, res, next) {
        try {
            const estimate = await EstimateModel.getAllEstimateForBrigadeFinishProject(req.params.id)
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllEstimateForBrigadeProject(req, res, next) {
        try {
            const estimate = await EstimateModel.getAllEstimateForBrigadeProject(req.params.id, req.params.project)
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllEstimateForProject(req, res, next) {
        try {
            const estimate = await EstimateModel.getAllEstimateForProject(req.params.id)
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const estimate = await EstimateModel.getOne(req.params.id)
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

 
   

    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const estimate = await EstimateModel.create( req.body)
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createEstimateBrigade(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара');
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления');
            }
    
            // Извлекаем данные из req.body
            const doneValues = Object.keys(req.body).map(key => key === 'true');
    
   
            const done = doneValues.includes(true) ? 'true' : 'false';
    
    
            const estimate = await EstimateModel.createEstimateBrigade(req.params.id, { done });
            res.json(estimate);
    
        } catch (e) {
            next(AppError.badRequest(e.message));
        }
    }

    async updateEstimatePrice(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const estimate = await EstimateModel.updateEstimatePrice(req.params.id, req.body,)
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateBrigadeForProject(req, res, next) {
        try {
            const id = req.params.id;
            const project = req.params.project
            const estimate = await EstimateModel.updateBrigadeForProject(id, project, req.body);
            res.json(estimate);
          
        } catch (e) {
          next(AppError.badRequest(e.message));
        }
      }

    async deleteEstimateBrigadeForProject(req, res, next) {
        try {
            const id = req.params.id;
            const project = req.params.project
            const estimate = await EstimateModel.deleteEstimateBrigadeForProject(id, project);
            res.json(estimate);
          
        } catch (e) {
          next(AppError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const estimate = await EstimateModel.delete(req.params.id)
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new estimateController()