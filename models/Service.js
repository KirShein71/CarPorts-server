import {Service as ServiceMapping} from './mapping.js'


class Service {
    async getAll() {
        const service = await ServiceMapping.findAll()
        return service
    }

    async getOne(id) {
        const service = await ServiceMapping.findByPk(id)
        if (!service) {
            throw new Error('Категория не найдена в БД')
        }
        return service
    }

    async create(data) {
        const {name} = data
        const service = await ServiceMapping.create({name})
        
        const created = await ServiceMapping.findByPk(service.id) 
        return created
    }

    async update(id, data) {
        const service = await ServiceMapping.findByPk(id)
        if (!service) {
            throw new Error('Услуга не найдена')
        }
        const {
            name = service.name,
            
        } = data
        await service.update({name})
        await service.reload()
        return service
    }

    async delete(id) {
        const service = await ServiceMapping.findByPk(id)
        if (!service) {
            throw new Error('Услуга не найдена в БД')
        }
        await service.destroy()
        return service
    }

}

export default new Service()