import {Examination as ExaminationMapping} from './mapping.js'


class Examination {
    async getAll() {
        const examination = await ExaminationMapping.findAll({
            
        })
        return examination
    }

    async getOne(id) {
        const examination = await ExaminationMapping.findByPk(id)
        if (!examination) {
            throw new Error('Пункт не найдена в БД')
        }
        return examination
    }

    async create(data) {
        const {name, number} = data
        const Examination = await ExaminationMapping.create({name, number})
        
        const created = await ExaminationMapping.findByPk(Examination.id) 
        return created
    }

    async update(id, data) {
        const examination = await ExaminationMapping.findByPk(id)
        if (!examination) {
            throw new Error('Пункт не найдена')
        }
        const {
            name = examination.name,
            number = examination.number
            
        } = data
        await examination.update({name, number})
        await examination.reload()
        return examination
    }

    async updateName(id, data) {
        const examination = await ExaminationMapping.findByPk(id)
        if (!examination) {
            throw new Error('Пункт не найдена')
        }
        const {
            name = examination.name,
            
        } = data
        await examination.update({name})
        await examination.reload()
        return examination
    }

    async updateNumber(id, data) {
        const examination = await ExaminationMapping.findByPk(id)
        if (!examination) {
            throw new Error('Пункт не найдена')
        }
        const {
            number = examination.number,
            
        } = data
        await examination.update({number})
        await examination.reload()
        return examination
    }

    async delete(id) {
        const examination = await ExaminationMapping.findByPk(id)
        if (!examination) {
            throw new Error('Пункт не найдена в БД')
        }
        await examination.destroy()
        return examination
    }

}

export default new Examination()