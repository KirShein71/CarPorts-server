import { Brigade as BrigadeMapping } from "./mapping.js";
import { Region as RegionMapping} from './mapping.js'
import FileService from '../services/File.js'

class Brigade {
    async getAll() {
        const brigades = await BrigadeMapping.findAll({
            include: [{model: RegionMapping, attributes: ['region']}]
        })
        return brigades
    }

    async getOne(id) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Категория не найдена в БД')
        }
        return brigade
    }

    async getByPhone(phone) {
        const brigade = await BrigadeMapping.findOne({where: {phone}})
        if (!brigade) {
            throw new Error('Пользователь не найден в БД')
        }
        return brigade
    }

    async create(data, img) {
        const {name, phone, regionId, role, password, active} = data
        const image = FileService.save(img) || ''
        const check = await BrigadeMapping.findOne({where: {phone}})
        if (check) {
            throw new Error('Пользователь уже существует')
        }
        const brigade = await BrigadeMapping.create({name, phone, image, regionId, role, password, active})
        
        const created = await BrigadeMapping.findByPk(brigade.id) 
        return created
    }

    async update(id, data, img) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Деталь не найдена в БД')
        }
        const file = FileService.save(img)
        if (file && brigade.image) {
            FileService.delete(brigade.image)
        }
        const {
            name = brigade.name,
            phone = brigade.phone,
            image = file ? file : brigade.image
            
        } = data
        await brigade.update({name, phone, image})
        await brigade.reload()
        return brigade
    }

    async updateActiveBrigade(id, data) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Бригада не найдена в БД')
        }
        
        const {
            active = brigade.active
            
        } = data
        await brigade.update({active})
        await brigade.reload()
        return brigade
    }

    async updateBrigadeName(id, data) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Деталь не найдена в БД')
        }
        const {
            name = brigade.name,
            
        } = data
        await brigade.update({name})
        await brigade.reload()
        return brigade
    }

    async updateBrigadePhone(id, data) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Деталь не найдена в БД')
        }
        const {
            phone = brigade.phone,
            
        } = data
        await brigade.update({phone})
        await brigade.reload()
        return brigade
    }

    async createPassword(id, data) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Деталь не найдена в БД')
        }
    
        const {
            password = brigade.password
            
        } = data
        await brigade.update({password})
        await brigade.reload()
        return brigade
    }


    async createRegion(id, data) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Бригада не найдена в БД')
        }
        const {
            regionId = brigade.regionId,
        } = data
        await brigade.update({regionId})
        await brigade.reload()
        return brigade
    }

    async delete(id) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Деталь не найдена в БД')
        }
        await brigade.destroy()
        return brigade
    }
}

export default new Brigade()