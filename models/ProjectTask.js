import { ProjectTask as ProjectTaskMapping } from './mapping.js';
import { Project as ProjectMapping } from './mapping.js'
import { TemplatesTask as TemplatesTaskMapping } from './mapping.js';



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
        const project_task = await ProjectTaskMapping.findAll({
            where: { done: 'false' }, // Фильтруем только активные задачи
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
                    term: item.term,
                    done: item.done,
                    executor: item.executor,
                    executor_name: item.executor_name
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
                        term: item.term,
                        done: item.done,
                        executor: item.executor,
                        executor_name: item.executor_name
                    }]
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
        const { number, name, projectId, term, note, done } = data;
        const project_task = await ProjectTaskMapping.create({ number, name, projectId, term, note, done});
        const created = await ProjectTaskMapping.findByPk(project_task.id);
        return created;
    }

    async createTasksFromTemplates(projectId, options = {}) {
        const templates = await TemplatesTaskMapping.findAll({
            attributes: ['number', 'name', 'note', 'term'],
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
            executor: null,
            executor_name: null

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
            term = project_task.term
        } = data
        await project_task.update({number, name, note, term})
        await project_task.reload()
        return project_task
    }

    async updateActiveProjectTask(id, data) {
        const project_task = await ProjectTaskMapping.findByPk(id)
        if (!project_task) {
            throw new Error('Задача не найдена в БД')
        }
        
        const {
            done = project_task.done
            
        } = data
        await project_task.update({done})
        await project_task.reload()
        return project_task
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