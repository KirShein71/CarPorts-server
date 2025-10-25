import { Detail as DetailMapping } from "./mapping.js";



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
        const {number, name, price} = data
        const detail = await DetailMapping.create({number, name, price})
        
        const created = await DetailMapping.findByPk(detail.id) 
        return created
    }

    async createPrice(id, data) {
        const detail = await DetailMapping.findByPk(id)
        if (!detail) {
            throw new Error('Деталь не найдена в БД')
        }
        const {

            price = detail.price
            
        } = data
        await detail.update({ price})
        await detail.reload()
        return detail
    }

    async createNumber(id, data) {
        const detail = await DetailMapping.findByPk(id)
        if (!detail) {
            throw new Error('Деталь не найдена в БД')
        }
        const {

            number = detail.number
            
        } = data
        await detail.update({ number})
        await detail.reload()
        return detail
    }

    async update(id, data) {
        const detail = await DetailMapping.findByPk(id)
        if (!detail) {
            throw new Error('Деталь не найдена в БД')
        }
        const {
            name = detail.name,
            price = detail.price
        
            
        } = data
        await detail.update({name, price})
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