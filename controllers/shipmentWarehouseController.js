import ShipmentWarehouseModel from '../models/ShipmentWarehouse.js'
import AppError from '../errors/AppError.js'


class ShipmentWarehouseController {
    async getAll(req, res, next) {
        try {
            const shipment_warehouse = await ShipmentWarehouseModel.getAll()
            res.json(shipment_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id детали')
            }
            const shipment_warehouse = await ShipmentWarehouseModel.getOne(req.params.id)
            res.json(shipment_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
   

    async create(req, res, next) {
        try {
          
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для создания')
            }
            const shipment_warehouse = await ShipmentWarehouseModel.create( req.body)
            res.json(shipment_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async createNote(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id товара')
            }
            if (Object.keys(req.body).length === 0) {
                throw new Error('Нет данных для обновления')
            }
            const shipment_warehouse = await ShipmentWarehouseModel.createNote(req.params.id, req.body,)
            res.json(shipment_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

    async deleteNote(req, res, next) {
        try {
            const id = req.params.note;
            
            const shipment_warehouse = await ShipmentWarehouseModel.deleteNote(id);
            res.json(shipment_warehouse);
        } catch(e) {
            next(AppError.badRequest(e.message));
        }
    }


    async delete(req, res, next) {
        try {
            if (!req.params.id) {
                throw new Error('Не указан id')
            }
            const warehouse_assortment = await ShipmentWarehouseModel.delete(req.params.id)
            res.json(warehouse_assortment)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }

  
}

export default new ShipmentWarehouseController()