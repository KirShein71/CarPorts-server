import {Сoefficient as CoefficientMapping} from './mapping.js'


class Coefficient {
    async getAll() {
        const coefficients = await CoefficientMapping.findAll({})
        return coefficients
    }



    async getOne(id) {
        const coefficient = await CoefficientMapping.findByPk(id)
        if (!Coefficient) {
            throw new Error('Коэффициент найден в БД')
        }
        return coefficient
    }


    async create(data) {
        const {name, number} = data
        const coefficient = await CoefficientMapping.create({name, number})
        
        const created = await CoefficientMapping.findByPk(coefficient.id) 
        return created
    }


    async updateCoefficientName(id, data) {
        const coefficient = await CoefficientMapping.findByPk(id)
        if (!coefficient) {
            throw new Error('Коэффициент не найден в БД')
        }
        const {
            name = coefficient.name,
            
        } = data
        await coefficient.update({name})
        await coefficient.reload()
        return coefficient
    }

    async updateCoefficientNumber(id, data) {
        const coefficient = await CoefficientMapping.findByPk(id)
        if (!coefficient) {
            throw new Error('Коэффициент не найден в БД')
        }
        const {
            number = coefficient.number,
            
        } = data
        await coefficient.update({number})
        await coefficient.reload()
        return coefficient
    }

    async delete(id) {
        const coefficient = await CoefficientMapping.findByPk(id)
        if (!coefficient) {
            throw new Error('Коэффициент не найден в БД')
        }
        await coefficient.destroy()
        return coefficient
    }
}

export default new Coefficient()