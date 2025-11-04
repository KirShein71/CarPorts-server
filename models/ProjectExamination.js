import { ProjectExamination as ProjectExaminationMapping } from './mapping.js';
import { Examination as ExaminationMapping} from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Brigade as BrigadeMapping} from './mapping.js'


class ProjectExamination {

    async getAll() {
        const project_examination = await ProjectExaminationMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name', 'number'], 
                },
                {
                    model: BrigadeMapping, 
                    attributes: ['name'],
                },
                {
                    model: ExaminationMapping, 
                    attributes: ['name']
                }
            ],
            order: [
                ['projectId', 'ASC'],
            ],
        });

        const formattedData = project_examination.reduce((acc, item) => {
            const { projectId, brigadeId, project, brigade, result } = item;
            
            // Создаем уникальный ключ для комбинации проекта и бригады
            const key = `${projectId}-${brigadeId}`;
            
            const existingGroup = acc.find(group => group.key === key);
            
            if (existingGroup) {
                // Добавляем результат в существующую группу
                existingGroup.results.push(result);
            } else {
                // Создаем новую группу
                acc.push({
                    key: key,
                    projectId: projectId,
                    brigadeId: brigadeId,
                    project: {
                        name: project.name,
                        number: project.number
                    },
                    brigade: {
                        name: brigade.name
                    },
                    results: [result] // массив всех результатов для этой пары
                });
            }
            return acc;
        }, []);

        // Вычисляем средний результат в процентах для каждой группы
        const resultWithAveragePercentage = formattedData.map(group => {
            const total = group.results.length;
            
            // Вычисляем сумму результатов (где -1, 0, 1)
            const sum = group.results.reduce((acc, result) => acc + result, 0);
            
            // Преобразуем в проценты: (sum / total) * 100
            // Максимально возможная сумма = total (если все результаты = 1)
            // Минимально возможная сумма = -total (если все результаты = -1)
            // Диапазон: от -100% до +100%
            const averagePercentage = total > 0 ? (sum / total) * 100 : 0;
            
            // Округляем до целого числа
            const averagePercentageRounded = Math.round(averagePercentage);

            return {
                projectId: group.projectId,
                brigadeId: group.brigadeId,
                project: group.project,
                brigade: group.brigade,
                averagePercentage: averagePercentageRounded, // Средний результат в процентах
                results: group.results // Можно убрать, если не нужны детальные результаты
            };
        });

        return resultWithAveragePercentage;
    }

    async getAllGroupByBrigade() {
        const project_examination = await ProjectExaminationMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name', 'number'], 
                },
                {
                    model: BrigadeMapping, 
                    attributes: ['name'],
                },
                {
                    model: ExaminationMapping, 
                    attributes: ['name']
                }
            ],
            order: [
                ['brigadeId', 'ASC'],
                ['projectId', 'ASC'],
            ],
        });

        // Группируем по бригадам
        const groupedByBrigade = project_examination.reduce((acc, item) => {
            const { brigadeId, brigade, projectId, project, result } = item;
            
            if (!acc[brigadeId]) {
                acc[brigadeId] = {
                    brigadeId: brigadeId,
                    brigadeName: brigade.name,
                    projects: {},
                    allResults: []
                };
            }
            
            if (!acc[brigadeId].projects[projectId]) {
                acc[brigadeId].projects[projectId] = {
                    projectId: projectId,
                    projectName: project.name,
                    projectNumber: project.number,
                    results: []
                };
            }
            
            acc[brigadeId].projects[projectId].results.push(result);
            acc[brigadeId].allResults.push(result);
            
            return acc;
        }, {});

        // Преобразуем в нужный формат и вычисляем средние результаты
        const result = Object.values(groupedByBrigade).map(brigadeGroup => {
            // ВАЖНО: Добавим отладочную информацию
            console.log('=== ОТЛАДКА БРИГАДА:', brigadeGroup.brigadeName, '===');
            
            // Вычисляем средний результат по всей бригаде (из всех проверок)
            const brigadeTotal = brigadeGroup.allResults.length;
            const brigadeSum = brigadeGroup.allResults.reduce((acc, result) => acc + result, 0);
            const brigadeAverageFromAllChecks = brigadeTotal > 0 ? 
                Math.round((brigadeSum / brigadeTotal) * 100) : 0;

            console.log('Расчет из всех проверок:', {
                всеРезультаты: brigadeGroup.allResults,
                суммаВсехРезультатов: brigadeSum,
                количествоПроверок: brigadeTotal,
                среднее: (brigadeSum / brigadeTotal),
                проценты: (brigadeSum / brigadeTotal) * 100,
                округленоПроценты: brigadeAverageFromAllChecks
            });

            // Преобразуем проекты из объекта в массив и вычисляем средние результаты
            const projects = Object.values(brigadeGroup.projects).map(project => {
                const total = project.results.length;
                const sum = project.results.reduce((acc, result) => acc + result, 0);
                const averagePercentage = total > 0 ? Math.round((sum / total) * 100) : 0;
                
                console.log(`Проект ${project.projectName}:`, {
                    результаты: project.results,
                    сумма: sum,
                    количество: total,
                    среднее: averagePercentage
                });
                
                return {
                    project: project.projectName,
                    number: project.projectNumber,
                    result: averagePercentage,
                    projectId: project.projectId
                };
            });

            // ВАРИАНТ 1: Среднее из средних проектов (то что вам нужно)
            const projectAverages = projects.map(p => p.result);
            const brigadeAverageFromProjects = projectAverages.length > 0 ? 
                Math.round(projectAverages.reduce((acc, avg) => acc + avg, 0) / projectAverages.length) : 0;

            console.log('Расчет из средних проектов:', {
                средниеПроектов: projectAverages,
                суммаСредних: projectAverages.reduce((acc, avg) => acc + avg, 0),
                количествоПроектов: projectAverages.length,
                среднееИзСредних: brigadeAverageFromProjects
            });

            return {
                brigade: brigadeGroup.brigadeName,
                brigadeId: brigadeGroup.brigadeId,
                brigadeAverage: brigadeAverageFromProjects, // Используем среднее из средних проектов
                projects: projects,
            };
        });

        return result;
    }

    async getAllProjectBrigadeExamination(projectId, brigadeId) {
        const project_examination = ProjectExaminationMapping.findAll({
            where: { 
                    project_id: projectId, 
                    brigade_id: brigadeId 
                }
        })

        if(!project_examination) {
            throw new Error('Данные отсутствуют')
        }

        return project_examination
    }

    async getAllExaminationForProject(id) {
        const project_examination = await ProjectExaminationMapping.findAll({
            where: {
                project_id: id
            },
            include: [
                { model: ExaminationMapping, attributes: ['name', 'number'] },
                    
            ]
        });
        
        // Группируем данные по brigadeId
        const groupedExaminations = project_examination.reduce((acc, examination) => {
            const brigadeId = examination.brigadeId; 
           
            if (!acc[brigadeId]) {
                acc[brigadeId] = {
                    brigadeId: brigadeId,
                    examinations: []
                };
            }
        
            acc[brigadeId].examinations.push(examination);
            return acc;
        }, {});
        
        // Преобразуем объект в массив для удобства
        const result = Object.values(groupedExaminations);
    
        return result;
    }
    
    async create(data) {
        const { examinationId, projectId, brigadeId, result } = data;
        const project_examination = await ProjectExaminationMapping.create({ examinationId, projectId, brigadeId, result });
        const created = await ProjectExaminationMapping.findByPk(project_examination.id);
        return created;
    }

    async updateResult(id, data) {
        const project_examination = await ProjectExaminationMapping.findByPk(id)
        if (!project_examination) {
            throw new Error('Пункт не найдена')
        }
        const {
            result = project_examination.result,
            
        } = data
        await project_examination.update({result})
        await project_examination.reload()
        return project_examination
    }


    async delete(id) {
        const projectExamination = await ProjectExaminationMapping.findOne({ where: { id: id } });
        if (!projectExamination) {
            throw new Error('Пункт не найден');
        }
        
        await projectExamination.destroy();
        return projectExamination;
    }

    async deleteAllProjectBrigade(projectId, brigadeId) {
        const deletedCount = await ProjectExaminationMapping.destroy({ 
            where: { 
                project_id: projectId, 
                brigade_id: brigadeId 
            } 
        });
        
        if (deletedCount === 0) {
            throw new Error('Пункты не найдены');
        }
        
        return { message: 'Пункты успешно удалены', deletedCount };
    }

}

export default new ProjectExamination()