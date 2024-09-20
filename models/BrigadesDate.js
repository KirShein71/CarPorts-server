import {BrigadesDate as BrigadesDateMapping} from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Brigade as BrigadeMapping } from './mapping.js'
import { Date as DateMapping} from './mapping.js'

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

    async getAllCertainDays() {
        const today = new Date();
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(today.getDate() - 3);
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
        const {  projectId, brigadeId, dateId, regionId, weekend, warranty } = data;
        const brigadesdate = await BrigadesDateMapping.create({projectId, brigadeId, dateId, regionId, weekend, warranty  });
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
            warranty = brigadesdate.warranty
        } = data
        await brigadesdate.update({projectId, weekend, warranty})
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
    
}

export default new BrigadesDate()