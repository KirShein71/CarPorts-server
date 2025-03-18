import ComplaintImageModel from '../models/ComplaintImage.js'
import AppError from '../errors/AppError.js'

class ComplaintImageController {
    async getAll(req, res, next) {
        try {
            const comaplaintimages = await ComplaintImageModel.getAll()
            res.json(comaplaintimages)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllByComplaintId(req, res, next) {
        try {
            const complaintimages = await ComplaintImageModel.getAllByComplaintId(req.params.id);
            res.json(complaintimages);
          
        } catch(e) {
            next(AppError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id материала')
            }
            const complaintimage = await ComplaintImageModel.getOne(req.params.id)
            res.json(complaintimage)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const complaintimage = await ComplaintImageModel.create(req.body, req.files.image)
            res.json(complaintimage)
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
            const image = await ComplaintImageModel.update(req.params.id, req.body, req.files.image)
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
            const complaintimage = await ComplaintImageModel.delete(req.params.id)
            res.json(complaintimage)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new ComplaintImageController()