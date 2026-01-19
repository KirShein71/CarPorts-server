import { WarehouseAssortment as WarehouseAssortmentMapping } from "./mapping.js";



class WarehouseAssortment {
    async getAll() {
        const warehouse_assortments = await WarehouseAssortmentMapping.findAll({
            order: [
                ['number', 'ASC'],
            ],
        }
            
        )
        return warehouse_assortments
    }

    async getOne(id) {
        const warehouse_assortment = await WarehouseAssortmentMapping.findByPk(id)
        if (!warehouse_assortment) {
            throw new Error('Деталь не найдена в БД')
        }
        return warehouse_assortment
    }

    async create(data) {
        const {name, cost_price, shipment_price, weight, number} = data
        const warehouse_assortment = await WarehouseAssortmentMapping.create({name, cost_price, shipment_price, weight, number})
        
        const created = await WarehouseAssortmentMapping.findByPk(warehouse_assortment.id) 
        return created
    }

   
    async update(id, data) {
        const warehouse_assortment = await WarehouseAssortmentMapping.findByPk(id)
        if (!warehouse_assortment) {
            throw new Error('Деталь не найдена в БД')
        }
        const {
            name = warehouse_assortment.name,
            cost_price = warehouse_assortment.cost_price,
            shipment_price = warehouse_assortment.shipment_price,
            weight = warehouse_assortment.weight,
            number = warehouse_assortment.number
            
        } = data
        await warehouse_assortment.update({ name, cost_price, shipment_price, weight, number})
        await warehouse_assortment.reload()
        return warehouse_assortment
    }
    

    async delete(id) {
        const warehouse_assortment = await WarehouseAssortmentMapping.findByPk(id)
        if (!warehouse_assortment) {
            throw new Error('Деталь не найдена в БД')
        }
        await warehouse_assortment.destroy()
        return warehouse_assortment
    }

}

export default new WarehouseAssortment()