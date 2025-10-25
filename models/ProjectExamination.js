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

        // Вычисляем процентное соотношение для каждой группы
        const resultWithPercentages = formattedData.map(group => {
            const total = group.results.length;
            const countMinusOne = group.results.filter(r => r === -1).length;
            const countZero = group.results.filter(r => r === 0).length;
            const countPlusOne = group.results.filter(r => r === 1).length;

            return {
                projectId: group.projectId,
                brigadeId: group.brigadeId,
                project: group.project,
                brigade: group.brigade,
                statistics: {
                    total: total,
                    minusOne: {
                        count: countMinusOne,
                        percentage: total > 0 ? (countMinusOne / total * 100).toFixed(1) : 0
                    },
                    zero: {
                        count: countZero,
                        percentage: total > 0 ? (countZero / total * 100).toFixed(1) : 0
                    },
                    plusOne: {
                        count: countPlusOne,
                        percentage: total > 0 ? (countPlusOne / total * 100).toFixed(1) : 0
                    }
                },
                results: group.results // опционально, можно убрать если не нужны детальные результаты
            };
        });

        return resultWithPercentages;
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