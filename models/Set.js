import { Set as SetMapping} from './mapping.js'
import { Region as RegionMapping} from './mapping.js'

class Set {
    async getAll() {
        const sets = await SetMapping.findAll({
            include: [{model: RegionMapping, attributes: ['region']}]
        })
        return sets
    }
    
    async getAllActiveSet() {
        const sets = await SetMapping.findAll({
            where: {
                active: 'true'
            },
            attributes: ['id', 'name', 'regionId', 'number'],
                
        })
        return sets
    }
    
    async getOne(id) {
        const set = await SetMapping.findByPk(id)
        if (!set) {
            throw new Error('Комплект не найден в БД')
        }
        return set
    }
    
    async create(data) {
        const {name, number, regionId, active} = data
          
        const set = await SetMapping.create({name, number, regionId, active})
            
        const created = await SetMapping.findByPk(set.id) 
        return created
    }
    
    async update(id, data) {
        const set = await SetMapping.findByPk(id)
        if (!set) {
            throw new Error('Комплект не найден в БД')
        }
           
        const {
            name = set.name,
            number = set.number,
            regionId = set.regionId    
        } = data
        await set.update({name, number, regionId})
        await set.reload()
        return set
    }
    
    async updateActiveSet(id, data) {
        const set = await SetMapping.findByPk(id)
        if (!set) {
            throw new Error('Комплект не найден в БД')
        }
            
        const {
            active = set.active
                
        } = data
        await set.update({active})
        await set.reload()
        return set
    }
    
       
    async delete(id) {
        const set = await SetMapping.findByPk(id)
        if (!set) {
            throw new Error('Комплект не найден в БД')
        }
        await set.destroy()
        return set
    }
}

export default new Set()