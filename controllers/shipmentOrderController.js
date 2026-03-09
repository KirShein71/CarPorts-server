import ShipmentOrderModel from '../models/ShipmentOrder.js'
import AppError from '../errors/AppError.js'

class ShipmentOrderController {

    async getAll(req, res, next) {
        try {
            const shipment_orders = await ShipmentOrderModel.getAll()
            res.json(shipment_orders)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getAllForShipmentOrderProject(req, res, next) {
        try {
            const { projectId, date } = req.params; 
            const shipment_orders = await ShipmentOrderModel.getAllForShipmentOrderProject(projectId, date)
            res.json(shipment_orders)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createShipmentOrder(req, res, next) {
        try {
            const { date, projectId } = req.params; 
            const createdShipmentOrder = await ShipmentOrderModel.createShipmentOrder(date, projectId);
            res.json(createdShipmentOrder);
        } catch (e) {
            next(AppError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            const shipment_orders = await ShipmentOrderModel.getOne(req.params.id)
            res.json(shipment_orders)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const shipment_orders = await ShipmentOrderModel.create( req.body)
            res.json(shipment_orders)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createAntypical(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const shipment_orders = await ShipmentOrderModel.createAntypical(req.body)
           
            res.json(shipment_orders)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createDateInShipmentOrderWithNoDate(req, res, next) {
        try {
            const { projectId } = req.params; 
            const createdShipmentOrder = await ShipmentOrderModel.createDateInShipmentOrderWithNoDate(projectId, req.body);
            
            res.json(createdShipmentOrder);
        } catch (e) {
            next(AppError.badRequest(e.message));
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
            const shipment_orders = await ShipmentOrderModel.update(req.params.id, req.body,)
            res.json(shipment_orders)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async deleteOneShipmentOrderDetail(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            const shipment_orders = await ShipmentOrderModel.deleteOneShipmentOrderDetail(req.params.id)
            res.json(shipment_orders)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new ShipmentOrderController()