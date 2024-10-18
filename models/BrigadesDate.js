import {BrigadesDate as BrigadesDateMapping} from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Brigade as BrigadeMapping } from './mapping.js'
import { Date as DateMapping} from './mapping.js'
import { Estimate as EstimateMapping } from './mapping.js'

import { Op} from 'sequelize'


class BrigadesDate {
    async getAll() {
        const brigadesdate = await BrigadesDateMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name', 'regionId'],
                },
                {
                    model: BrigadeMapping,
                    attributes: ['name', 'regionId']
                },
                {
                    model: DateMapping,
                    attributes: ['date']
                }
              ],
        })
        
          return brigadesdate;
    }

    async getAllForOneBrigade(brigadeId) {
        const brigadesdate = await BrigadesDateMapping.findAll({
            where: {
                brigade_id: brigadeId
            },
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name'], 
                    include: {
                        model: EstimateMapping, attributes: ['price', 'done']
                    }
                },
                {
                    model: DateMapping,
                    attributes: ['date']
                }
              ],
        })
        
          return brigadesdate;
    }

    async getAllCertainDays() {
        const today = new Date();
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(today.getDate() - 1);
        const threeDaysLater = new Date(today);
        threeDaysLater.setDate(today.getDate() + 3);
    
        const brigadesdate = await BrigadesDateMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name'],
                },
                {
                    model: BrigadeMapping,
                    attributes: ['name']
                },
                {
                    model: DateMapping,
                    attributes: ['date'],
                    where: {
                        date: {
                            [Op.between]: [threeDaysAgo, threeDaysLater]
                        }
                    }
                }
            ],
        });
    
        return brigadesdate;
    }
    
    async getOne(id) {
        const brigadesdate = await BrigadesDateMapping.findByPk(id)
        if (!brigadesdate) { 
            throw new Error('Товар не найден в БД')
        }
        return brigadesdate
    } 



    async create(data) {
        const {  projectId, brigadeId, dateId, regionId, weekend, warranty, downtime } = data;
        const brigadesdate = await BrigadesDateMapping.create({projectId, brigadeId, dateId, regionId, weekend, warranty, downtime  });
        const created = await BrigadesDateMapping.findByPk(brigadesdate.id);
        return created;
    }



    async updateBrigadesDate(id, data) {
        const brigadesdate = await BrigadesDateMapping.findByPk(id)
        if (!brigadesdate) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            projectId = brigadesdate.projectId,
            weekend = brigadesdate.weekend,
            warranty = brigadesdate.warranty,
            downtime = brigadesdate.downtime
        } = data
        await brigadesdate.update({projectId, weekend, warranty, downtime})
        await brigadesdate.reload()
        return brigadesdate
    }

    async delete(id) {
        const brigadesdate = await BrigadesDateMapping.findByPk(id);
        if (!brigadesdate) {
            throw new Error('Строка не найдена в БД');
        }
    
        await brigadesdate.destroy();
        return brigadesdate;
    }

    async getAllDate() {
        const date = await DateMapping.findAll({
            order: [['id', 'ASC']]
        })
          return date;
    }

    async getAllNumberOfDaysBrigade(brigadeId, projectId) {
        const brigadesdate = await BrigadesDateMapping.findAll({
            where: {
                brigade_id: brigadeId,
                project_id: projectId
            }
        })

        if(!brigadesdate) {
            throw new Error('Не проставлены дни в календарь')
        }

        const days = brigadesdate.length

        return days
    }

    async getAllNumberOfDaysBrigadeForProject(brigadeId) {
        const brigadesdate = await BrigadesDateMapping.findAll({
            where: {
                brigade_id: brigadeId,
            }
        });
    
        if (!brigadesdate || brigadesdate.length === 0) {
            throw new Error('Не проставлены дни в календарь');
        }
    
        // Создаем объект для хранения количества дней по каждому projectId
        const projectDaysCount = {};
    
        // Подсчитываем количество строк для каждого projectId
        brigadesdate.forEach((brigdate) => {
            if (brigdate.projectId !== 0) {
                if (!projectDaysCount[brigdate.projectId]) {
                    projectDaysCount[brigdate.projectId] = 0;
                }
                projectDaysCount[brigdate.projectId]++;
            }
        });
    
        // Преобразуем объект в массив
        const result = Object.entries(projectDaysCount).map(([projectId, days]) => ({
            projectId: Number(projectId), 
            days,
        }));
    
        return result;
    }
    
}

export default new BrigadesDate()