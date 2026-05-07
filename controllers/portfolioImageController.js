import PortfolioImageModel from '../models/PortfolioImage.js'
import AppError from '../errors/AppError.js'

class PortfolioImageController {
    async getAllByProjectId(req, res, next) {
        try {
            const portfolio_images = await PortfolioImageModel.getAllByProjectId(req.params.id);
            res.json(portfolio_images);
        } catch(e) {
            next(AppError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id изображения')
            }
            const portfolio_image = await PortfolioImageModel.getOne(req.params.id)
            res.json(portfolio_image)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для отправки')
            }
            const portfolio_image = await PortfolioImageModel.create(req.body, req.files.image)
            
            res.json(portfolio_image)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    
    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            const portfolio_image = await PortfolioImageModel.delete(req.params.id)
            res.json(portfolio_image)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new PortfolioImageController()