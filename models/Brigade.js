import { Brigade as BrigadeMapping } from "./mapping.js";
import FileService from '../services/File.js'

class Brigade {
    async getAll() {
        const brigades = await BrigadeMapping.findAll()
        return brigades
    }

    async getOne(id) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Категория не найдена в БД')
        }
        return brigade
    }

    async create(data, img) {
        const {name, phone} = data
        const image = FileService.save(img) ?? ''
        const brigade = await BrigadeMapping.create({name, phone, image})
        
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