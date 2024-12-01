import { BrigadeWork as BrigadeWorkMapping } from "./mapping.js";

class BrigadeWork {

    async getAll() {
        const brigadework = await BrigadeWorkMapping.findAll()

        return brigadework
    }

    async getOne(id) {
        const brigadework = await BrigadeWorkMapping.findByPk(id)
        if (!brigadework) { 
            throw new Error('Товар не найден в БД')
        }
        return brigadework
    } 

    async create(data) {
        const { regionId, count } = data;
        const brigadework = await BrigadeWorkMapping.create({regionId, count  });
        const created = await BrigadeWorkMapping.findByPk(brigadework.id);
        return created;
    }

    async updateCount(id, data) {
        const brigadework = await BrigadeWorkMapping.findByPk(id)
        if (!brigadework) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            count = brigadework.count,
           
        } = data
        await brigadework.update({count})
        await brigadework.reload()
        return brigadework
    }

}

export default new BrigadeWork;