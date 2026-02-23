import { ProjectTask as ProjectTaskMapping } from './mapping.js';
import { Project as ProjectMapping } from './mapping.js'
import { TemplatesTask as TemplatesTaskMapping } from './mapping.js';
import sequelize from '../sequelize.js';



class ProjectTask {
    async getAll() {
        const project_task = await ProjectTaskMapping.findAll({
            include: [
            {
                model: ProjectMapping,
                attributes: ['name', 'number', 'finish'],
            },
            ],
            order: [
                ['projectId', 'DESC'],
            ],
        });

        const formattedData = project_task.reduce((acc, item) => {
            const { projectId, project, id } = item;
            const existingProject = acc.find((project) => project.projectId === projectId);
            
            if (existingProject) {
            existingProject.props.push({ 
                id: id, 
                number: item.number,
                name: item.name, 
                note: item.note, 
                term: item.term
              
            });
            
            } else {
            acc.push({
                projectId: projectId,
                project: {
                    name: project.name,
                    number: project.number,
                    finish: project.finish
                },
                props: [{ 
                    id: id, 
                    number: item.number,
                    name: item.name, 
                    note: item.note, 
                    term: item.term
                }]
            });
            }
            return acc;
        }, []);

        return formattedData;
    }

  async getAllActiveTaskProject() {
    const now = new Date();
    
    // 1. Получаем все невыполненные задачи с проектами
    const tasks = await ProjectTaskMapping.findAll({
        where: { done: 'false' },
        include: [{
            model: ProjectMapping,
            attributes: ['name', 'number', 'finish']
        }],
        order: [['projectId', 'DESC'], ['number', 'ASC']]
    });

    // 2. Собираем все номера задач, от которых есть зависимости
    const dependentTaskNumbers = tasks
        .filter(t => t.previous_task)
        .map(t => t.previous_task);
    
    // 3. Получаем информацию о предыдущих задачах (включая выполненные)
    const prevTasks = await ProjectTaskMapping.findAll({
        where: {
            number: dependentTaskNumbers,
            projectId: tasks.map(t => t.projectId)
        },
        attributes: ['number', 'done', 'done_date', 'projectId']
    });

    // 4. Создаем карту для быстрого доступа к предыдущим задачам
    const prevTasksMap = {};
    prevTasks.forEach(t => {
        if (!prevTasksMap[t.projectId]) prevTasksMap[t.projectId] = {};
        prevTasksMap[t.projectId][t.number] = t;
    });

    // 5. Фильтруем задачи
    const activeTasks = tasks.filter(task => {
        // Если нет зависимости - показываем сразу
        if (!task.previous_task) return true;
        
        // Ищем предыдущую задачу
        const prevTask = prevTasksMap[task.projectId]?.[task.previous_task];
        
        // Если предыдущей задачи нет в БД - возможно, ошибка, но показываем
        if (!prevTask) return true;
        
        // Если предыдущая не выполнена - текущую не показываем
        if (!prevTask.done || !prevTask.done_date) return false;
        
        // Вычисляем дату старта текущей задачи
        const startDate = new Date(prevTask.done_date);
        startDate.setDate(startDate.getDate() + (task.term_integer || 0));
        
        // Показываем только если дата старта наступила
        return now >= startDate;
    });

    // 6. Группировка по проектам
    const formattedData = activeTasks.reduce((acc, item) => {
        const projectId = item.projectId;
        const existingProject = acc.find(p => p.projectId === projectId);

        const taskProps = {
            id: item.id,
            number: item.number,
            name: item.name,
            note: item.note,
            term: item.term,
            term_integer: item.term_integer,
            previous_task: item.previous_task,
            done: item.done,
            done_date: item.done_date,
            executor: item.executor,
            executor_name: item.executor_name
        };

        if (existingProject) {
            existingProject.props.push(taskProps);
        } else {
            acc.push({
                projectId: projectId,
                project: {
                    name: item.project.name,
                    number: item.project.number,
                    finish: item.project.finish
                },
                props: [taskProps]
            });
        }
        return acc;
    }, []);

    return formattedData;
}

          
    async getOne(id) {
        const project_task = await ProjectTaskMapping.findByPk(id)
        if (!project_task) { 
            throw new Error('Строка не найдена в БД')
        }
        return project_task
    } 

    async getAllTaskForProject(id) {
        const project_task = await ProjectTaskMapping.findAll({
            where: {
                project_id: id
            },
        });
        if (!project_task) { 
            throw new Error('Строка не найдена в БД')
        }
        return project_task;
          
    }



    async create(data) {
        const { number, name, projectId, term, note, done, executor, executor_name, previous_task, term_integer, done_date } = data;
         const executorValue = executor ? parseInt(executor) : null;
         const previousTaskValue = previous_task ? parseInt(previous_task) : null;
        const termIntegerValue = term_integer ? parseInt(term_integer) : null;
        const project_task = await ProjectTaskMapping.create({ number, name, projectId, term, note, done, executor: executorValue, executor_name, previous_task: previousTaskValue, term_integer: termIntegerValue, done_date});
        const created = await ProjectTaskMapping.findByPk(project_task.id);
        return created;
    }

    async createTasksFromTemplates(projectId, options = {}) {
        const templates = await TemplatesTaskMapping.findAll({
            attributes: ['number', 'name', 'note', 'term', 'executor', 'executor_name', 'previous_task', 'term_integer'],
            raw: true,
            transaction: options.transaction 
        });

        if (!templates || templates.length === 0) {
            return []; 
        }


        const tasksData = templates.map(template => ({
            projectId: projectId,
            number: template.number,
            name: template.name,
            note: template.note || '',
            term: template.term || '',
            done: 'false',
            executor: template.executor,
            executor_name: template.executor_name,
            previous_task: template.previous_task,
            term_integer: template.term_integer,
            date_done: null

        }));

        // 3. Массово создаём записи
        const createdTasks = await ProjectTaskMapping.bulkCreate(tasksData, {
            returning: true, // вернуть созданные записи (если нужно)
            transaction: options.transaction
        });

        return createdTasks;
    }

    async createExecutorProjectTask(id, data) {
        const project_task = await ProjectTaskMapping.findByPk(id)
        if (!project_task) {
            throw new Error('Задача не найдена в БД')
        }
        
        const {
            executor = project_task.executor,
            executor_name = project_task.executor_name
            
        } = data
        await project_task.update({executor, executor_name})
        await project_task.reload()
        return project_task
    }

    async update(id, data) {
        const project_task = await ProjectTaskMapping.findByPk(id)
        if (!project_task) {
            throw new Error('Задача не найдена в БД')
        }
        const {
            number = project_task.number,
            name = project_task.name,
            note = project_task.note,
            term = project_task.term,
            term_integer = project_task.term_integer,
            previous_task = project_task.previous_task
        } = data
        await project_task.update({number, name, note, term, term_integer, previous_task})
        await project_task.reload()
        return project_task
    }

    async updateActiveProjectTask(id, data) {
        const project_task = await ProjectTaskMapping.findByPk(id);
        if (!project_task) {
            throw new Error('Задача не найдена в БД');
        }
        
        const updateData = {};
        
        if (data.done !== undefined) {
            updateData.done = data.done;
        }
        
        if (data.done_date !== undefined) {
        
            updateData.done_date = data.done_date === '' ? null : data.done_date;
        }
        
        await project_task.update(updateData);
        await project_task.reload();
        return project_task;
    }


    async deleteTask(id) {
        const warehouse_assortment = await ProjectTaskMapping.findByPk(id)
        if (!warehouse_assortment) {
            throw new Error('Задача не найдена в БД')
        }
        await warehouse_assortment.destroy()
        return warehouse_assortment
    }

}

export default new ProjectTask()