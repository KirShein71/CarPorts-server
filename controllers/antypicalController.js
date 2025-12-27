import AntypicalModel from '../models/Antypical.js'
import AppError from '../errors/AppError.js'

class AntypicalController {
    async getAll(req, res, next) {
        try {
            const antypical = await AntypicalModel.getAll()
            res.json(antypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllAntypiclasForProject(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id проекта')
            }
            const antypical = await AntypicalModel.getAllAntypiclasForProject(req.params.id)
            res.json(antypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllForAntypicalsShipment(req, res, next) {
        try {
            const antypical = await AntypicalModel.getAllForAntypicalsShipment()
            res.json(antypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            const antypical = await AntypicalModel.getOne(req.params.id)
            res.json(antypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const antypical = await AntypicalModel.create(req.body, req.files.image)
            res.json(antypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createColor(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const antypical = await AntypicalModel.createColor(req.params.id, req.body)
            res.json(antypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createName(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const antypical = await AntypicalModel.createName(req.params.id, req.body)
            res.json(antypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createAntypicalsQuantity(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const antypical = await AntypicalModel.createAntypicalsQuantity(req.params.id, req.body)
            res.json(antypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createAntypicalsShipmentQuantity(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const antypical = await AntypicalModel.createAntypicalsShipmentQuantity(req.params.id, req.body)
            res.json(antypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createAntypicalsWeldersQuantity(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const antypical = await AntypicalModel.createAntypicalsWeldersQuantity(req.params.id, req.body)
            res.json(antypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createAntypicalsDeliveryQuantity(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const antypical = await AntypicalModel.createAntypicalsDeliveryQuantity(req.params.id, req.body)
            res.json(antypical)
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
            const antypical = await AntypicalModel.update(req.params.id, req.body, req.files.image)
            res.json(antypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id изображения')
            }
            const antypical = await AntypicalModel.delete(req.params.id)
            res.json(antypical)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new AntypicalController()