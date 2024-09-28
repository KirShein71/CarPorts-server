import {Estimate as EstimateMapping} from './mapping.js'
import { Service as ServiceMapping } from './mapping.js';


class Estimate {
    async getAll() {
        const estimate = await EstimateMapping.findAll({})
        
          return estimate;
    }

    async getAllEstimateForBrigade() {
        const estimate = await EstimateMapping.findAll({
            include: [
                {model: ServiceMapping, attributes: ['name']}
            ]
        })

        return estimate
    }

    async getOne(id) {
        const estimate = await EstimateMapping.findByPk(id)
        if (!estimate) { 
            throw new Error('Строка не найдена в БД')
        }
        return estimate
    } 



    async create(data) {
        const {  projectId, serviceId, price} = data;
        const estimate = await EstimateMapping.create({projectId, serviceId, price });
        const created = await EstimateMapping.findByPk(estimate.id);
        return created;
    }



    async updateEstimatePrice(id, data) {
        const estimate = await EstimateMapping.findByPk(id)
        if (!estimate) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            price = estimate.price,
        } = data
        await estimate.update({price})
        await estimate.reload()
        return estimate
    }

    async delete(id) {
        const estimate = await EstimateMapping.findByPk(id);
        if (!estimate) {
            throw new Error('Строка не найдена в БД');
        }
    
        await estimate.destroy();
        return estimate;
    }
    
}

export default new Estimate()