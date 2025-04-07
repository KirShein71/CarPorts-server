import ComplaintEstimateModel from '../models/ComplaintEstimate.js'
import AppError from '../errors/AppError.js'


class complaintEstimateController {
    async getAll(req, res, next) {
        try {
            const complaint_estimate = await ComplaintEstimateModel.getAll()
            res.json(complaint_estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllEstimateForComplaint(req, res, next) {
        try {
            const complaint_estimate = await ComplaintEstimateModel.getAllEstimateForComplaint(req.params.id)
            res.json(complaint_estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllEstimateForBrigadeComplaint(req, res, next) {
        try {
            const estimate = await ComplaintEstimateModel.getAllEstimateForBrigadeComplaint(req.params.id, req.params.complaint)
            res.json(estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllComplaintEstimateForBrigadeForAllProject(req, res, next) {
        try {
            const estimate = await ComplaintEstimateModel.getAllComplaintEstimateForBrigadeForAllProject(req.params.id)
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
            const complaint_estimate = await ComplaintEstimateModel.getOne(req.params.id)
            res.json(complaint_estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

 
   

    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const complaint_estimate = await ComplaintEstimateModel.create(req.body)
            res.json(complaint_estimate)
        
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
    
    
            const complaint_estimate = await ComplaintEstimateModel.createEstimateBrigade(req.params.id, { done });
            res.json(complaint_estimate);
    
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
            const complaint_estimate = await ComplaintEstimateModel.updateEstimatePrice(req.params.id, req.body,)
            res.json(complaint_estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async updateBrigadeForComplaint(req, res, next) {
        try {
            const id = req.params.id;
            const complaint = req.params.complaint
            const complaint_estimate = await ComplaintEstimateModel.updateBrigadeForComplaint(id, complaint, req.body);
            res.json(complaint_estimate);
       
          
        } catch (e) {
          next(AppError.badRequest(e.message));
        }
      }

    async deleteEstimateBrigadeForComplaint(req, res, next) {
        try {
            const id = req.params.id;
            const complaint = req.params.complaint
            const complaint_estimate = await ComplaintEstimateModel.deleteEstimateBrigadeForComplaint(id, complaint);
            res.json(complaint_estimate);
          
        } catch (e) {
          next(AppError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id пользователя')
            }
            const complaint_estimate = await ComplaintEstimateModel.delete(req.params.id)
            res.json(complaint_estimate)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new complaintEstimateController()