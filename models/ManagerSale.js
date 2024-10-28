import { ManagerSale as ManagerSaleMapping } from "./mapping.js";

class ManagerSale {
    async getAll() {
        const manager = await ManagerSaleMapping.findAll()
        return manager
    }

    
    async getOne(id) {
            const manager = await ManagerSaleMapping.findByPk(id);
            if (!manager) {
              throw new Error('Пользователь не найден в БД');
            }
            return manager;
          }

    async getByPhone(phone) {
        const manager = await ManagerSaleMapping.findOne({where: {phone}})
        if (!manager) {
            throw new Error('Пользователь не найден в БД')
        }
        return manager
    }


    async create(data) {
        const {phone, password, role, name} = data
        const check = await ManagerSaleMapping.findOne({where: {phone}})
        if (check) {
            throw new Error('Пользователь уже существует')
        }
        const manager = await ManagerSaleMapping.create({phone, password, role, name})
        return manager
    }

    async updatePassword(id, data) {
        const manager = await ManagerSaleMapping.findByPk(id)
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
        const manager = await ManagerSaleMapping.findByPk(id)
        if (!manager) {
            throw new Error('Пользователь не найден в БД')
        }
        await manager.destroy()
        return manager
    }
}


export default new ManagerSale()