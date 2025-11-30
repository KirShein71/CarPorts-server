import { Designer as DesignerMapping } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'


class Designer {
    async getAll() {
        const designers = await DesignerMapping.findAll({})
        return designers
    }

    async getAllActiveDesigner() {
        const designers = await DesignerMapping.findAll({
            where: {
                active: 'true'
            },
            attributes: ['id', 'name'],
            
        })
        return designers
    }

    async getOne(id) {
        const designer = await DesignerMapping.findByPk(id)
        if (!designer) {
            throw new Error('Проектировщик не найден в БД')
        }
        return designer
    }


    async create(data) {
        const {name, active} = data
        const designer = await DesignerMapping.create({name, active})
        
        const created = await DesignerMapping.findByPk(designer.id) 
        return created
    }

   
    async updateActiveDesigner(id, data) {
        const designer = await DesignerMapping.findByPk(id)
        if (!designer) {
            throw new Error('Проектировщик не найден в БД')
        }
        
        const {
            active = designer.active
            
        } = data
        await designer.update({active})
        await designer.reload()
        return designer
    }

    async updateDesignerName(id, data) {
        const designer = await DesignerMapping.findByPk(id)
        if (!designer) {
            throw new Error('Проектировщик не найден в БД')
        }
        
        const oldName = designer.name; // сохраняем старое имя
        const { name = designer.name } = data;
        
        // Обновляем имя проектировщика
        await designer.update({ name });
        
        // Если имя изменилось, обновляем все проекты с этим designerId
        if (oldName !== name) {
            await ProjectMapping.update(
                { designer: name }, // устанавливаем новое имя
                { 
                    where: { 
                        designerId: id // где designerId равен id проектировщика
                    } 
                }
            );
        }
        
        await designer.reload();
        return designer;
    }


    async delete(id) {
        const designer = await DesignerMapping.findByPk(id)
        if (!designer) {
            throw new Error('Проектировщик не найден в БД')
        }
        await designer.destroy()
        return designer
    }
}

export default new Designer()