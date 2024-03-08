import { Detail as DetailMapping } from "./mapping.js";

import AppError from "../errors/AppError.js";

class Detail {
    async getAll() {
        const details = await DetailMapping.findAll()
        return details
    }

    async getOne(id) {
        const detail = await DetailMapping.findByPk(id)
        if (!detail) {
            throw new Error('Деталь не найдена в БД')
        }
        return detail
    }

    async create(data) {
        const {name} = data
        const detail = await DetailMapping.create({name})
        
        const created = await DetailMapping.findByPk(detail.id) 
        return created
    }

    async update(id, data) {
        const detail = await DetailMapping.findByPk(id)
        if (!detail) {
            throw new Error('Деталь не найдена в БД')
        }
        const {
            name = detail.name,
            
        } = data
        await detail.update({name})
        await detail.reload()
        return detail
    }

    async delete(id) {
        const detail = await DetailMapping.findByPk(id)
        if (!detail) {
            throw new Error('Деталь не найдена в БД')
        }
        await detail.destroy()
        return detail
    }

}

export default new Detail()