import TotalWarehouseModel  from '../models/TotalWarehouse.js'
import AppError from '../errors/AppError.js'

class TotalWarehouseController {
    async getTotalWarehouseData(req, res, next) {
        try {
            const total_warehouse = await TotalWarehouseModel.getTotalWarehouseData()
            res.json(total_warehouse)
        } catch(e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new TotalWarehouseController()