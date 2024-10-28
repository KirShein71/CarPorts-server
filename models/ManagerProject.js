import {ManagerProject as ManagerProjectMapping} from './mapping.js'

class ManagerProject {
    async getAll() {
        const manager = await ManagerProjectMapping.findAll()
        return manager
    }

    
    async getOne(id) {
            const manager = await ManagerProjectMapping.findByPk(id);
            if (!manager) {
              throw new Error('Пользователь не найден в БД');
            }
            return manager;
          }

    async getByPhone(phone) {
        const manager = await ManagerProjectMapping.findOne({where: {phone}})
        if (!manager) {
            throw new Error('Пользователь не найден в БД')
        }
        return manager
    }


    async create(data) {
        const {phone, password, role, name} = data
        const check = await ManagerProjectMapping.findOne({where: {phone}})
        if (check) {
            throw new Error('Пользователь уже существует')
        }
        const manager = await ManagerProjectMapping.create({phone, password, role, name})
        return manager
    }

    async updatePassword(id, data) {
        const manager = await ManagerProjectMapping.findByPk(id)
        if (!manager) {
            throw new Error('Деталь не найдена в БД')
        }
    
        const {
            password = manager.password
            
        } = data
        await manager.update({password})
        await manager.reload()
        return manager
    }


    async delete(id) {
        const manager = await ManagerProjectMapping.findByPk(id)
        if (!manager) {
            throw new Error('Пользователь не найден в БД')
        }
        await manager.destroy()
        return manager
    }
}


export default new ManagerProject()