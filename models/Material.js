import { Material as MaterialMapping } from "./mapping.js";


class Material {
    async getAll() {
        const materials = await MaterialMapping.findAll()
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
        const {name} = data
        const material = await MaterialMapping.create({name})
        
        const created = await MaterialMapping.findByPk(material.id) 
        return created
    }

    async update(id, data) {
        const material = await MaterialMapping.findByPk(id)
        if (!material) {
            throw new Error('Деталь не найдена в БД')
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