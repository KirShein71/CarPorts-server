import { Supplier as SupplierMapping } from "./mapping.js"


class Supplier {
    async getAll() {
        const suppliers = await SupplierMapping.findAll()
        return suppliers
    }

    async getOne(id) {
        const supplier = await SupplierMapping.findByPk(id)
        if (!supplier) {
            throw new Error('Поставщик не найден в БД')
        }
        return supplier
    }

    async create(data) {
        const {name, contact, address, shipment, navigator, note, coordinates, regionId} = data
        const supplier = await SupplierMapping.create({name, contact, address, shipment, navigator, note, coordinates, regionId})
        
        const created = await SupplierMapping.findByPk(supplier.id) 
        return created
    }

    async update(id, data) {
        const supplier = await SupplierMapping.findByPk(id)
        if (!supplier) {
            throw new Error('Поставщик не найден в БД')
        }
        const {
            name = supplier.name,
            contact = supplier.contact,
            address = supplier.address,
            shipment = supplier.shipment,
            navigator = supplier.navigator,
            note = supplier.navigator,
            coordinates = supplier.coordinates,
            regionId = supplier.regionId
            
            
        } = data
        await supplier.update({name, contact, address, shipment, navigator, note, coordinates, regionId})
        await supplier.reload()
        return supplier
    }

    async delete(id) {
        const supplier = await SupplierMapping.findByPk(id)
        if (!supplier) {
            throw new Error('Поставщик не найден в БД')
        }
        await supplier.destroy()
        return supplier
    }

}

export default new Supplier()