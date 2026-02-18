import { TemplatesTask as TemplatesTaskMapping } from "./mapping.js";



class TemplatesTask {
    async getAll() {
        const templates_tasks = await TemplatesTaskMapping.findAll({
            order: [
                ['number', 'ASC'],
            ],
        }
            
        )
        return templates_tasks
    }

    async getAllActiveTemplatesTask() {
        const templates_tasks = await TemplatesTaskMapping.findAll({
            where: {
                active: 'true'
            },
            order: [
                ['number', 'ASC'],
            ],
            
        })
        return templates_tasks
    }

    async getOne(id) {
        const templates_task = await TemplatesTaskMapping.findByPk(id)
        if (!templates_task) {
            throw new Error('Шаблон не найден в БД')
        }
        return templates_task
    }

    async create(data) {
        const {name, note, term, number, active, executor, executor_name} = data
        const executorValue = executor ? parseInt(executor) : null;
        const templates_task = await TemplatesTaskMapping.create({name, note, term, number, active, executor: executorValue, executor_name})
        
        const created = await TemplatesTaskMapping.findByPk(templates_task.id) 
        return created
    }

   
    async update(id, data) {
        const templates_task = await TemplatesTaskMapping.findByPk(id)
        if (!templates_task) {
            throw new Error('Деталь не найдена в БД')
        }
        const {
            name = templates_task.name,
            note = templates_task.note,
            term = templates_task.term,
            number = templates_task.number,
            executor = templates_task.executor,
            executor_name = templates_task.executor_name
            
        } = data
        await templates_task.update({ name, note, term, number, executor, executor_name})
        await templates_task.reload()
        return templates_task
    }

    async updateActiveTemplatesTask(id, data) {
        const templates_task = await TemplatesTaskMapping.findByPk(id)
        if (!templates_task) {
            throw new Error('Шаблон не найден в БД')
        }
        
        const {
            active = templates_task.active
            
        } = data
        await templates_task.update({active})
        await templates_task.reload()
        return templates_task
    }
    

    async delete(id) {
        const templates_task = await TemplatesTaskMapping.findByPk(id)
        if (!templates_task) {
            throw new Error('Шаблон не найден в БД')
        }
        await templates_task.destroy()
        return templates_task
    }

}

export default new TemplatesTask()