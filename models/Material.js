import { Material as MaterialMapping } from "./mapping.js";
import { Supplier as SupplierMapping } from "./mapping.js";


class Material {
    async getAll() {
        const materials = await MaterialMapping.findAll({
            include: [{model: SupplierMapping, attributes: ['name']}]
        })
        return materials
    }

    async getOne(id) {
        const material = await MaterialMapping.findByPk(id)
        if (!material) {
            throw new Error('Категория не найдена в БД')
        }
        return material
    }

    async create(data) {
        const {name, supplierId} = data
        const material = await MaterialMapping.create({name, supplierId})
        
        const created = await MaterialMapping.findByPk(material.id) 
        return created
    }

    async createSupplier(id, data) {
        const material = await MaterialMapping.findByPk(id)
        if (!material) {
            throw new Error('Материал не найден в БД')
        }
        const {
            supplierId = material.supplierId,
            
        } = data
        await material.update({supplierId})
        await material.reload()
        return material
    }

    async update(id, data) {
        const material = await MaterialMapping.findByPk(id)
        if (!material) {
            throw new Error('Материал не найден в БД')
        }
        const {
            name = material.name,
            
        } = data
        await material.update({name})
        await material.reload()
        return material
    }

    async delete(id) {
        const material = await MaterialMapping.findByPk(id)
        if (!material) {
            throw new Error('Материал не найдена в БД')
        }
        await material.destroy()
        return material
    }

}

export default new Material()