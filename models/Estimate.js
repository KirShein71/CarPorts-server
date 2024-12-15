import {Estimate as EstimateMapping} from './mapping.js'
import { Service as ServiceMapping } from './mapping.js';
import { Project as ProjectMapping } from './mapping.js';
import { Payment as PaymentMapping} from './mapping.js'




class Estimate {
    async getAll() {
        const estimate = await EstimateMapping.findAll({})
        
          return estimate;
    }

    async getAllEstimateForBrigade(id) {
        const estimates = await EstimateMapping.findAll({
            where: {
                brigade_id: id
            },
            include: [
                { model: ServiceMapping, attributes: ['name'] },
                { model: ProjectMapping, attributes: ['name', 'date_finish', 'installation_billing'] } 
            ]
        });
    
        const groupedEstimates = estimates.reduce((acc, estimate) => {
            const projectId = estimate.projectId; // Получаем id проекта
            const projectName = estimate.project.name; // Получаем название проекта
            const projectFinish = estimate.project.date_finish;
            const installationBilling = estimate.project.installation_billing
    
            // Проверяем, если projectFinish равен null
            if (projectFinish === null) {
                if (!acc[projectId]) {
                    acc[projectId] = {
                        projectId: projectId,
                        projectName: projectName, // Добавляем название проекта
                        installationBilling: installationBilling,
                        estimates: []
                    };
                }
    
                acc[projectId].estimates.push(estimate);
            }
    
            return acc;
        }, {});
    
        // Преобразуем объект в массив для удобства
        const result = Object.values(groupedEstimates);
    
        return result;
    }

    async getAllEstimateForBrigadeProject(id, project) {
        const estimate = await EstimateMapping.findAll({
            where: {
                brigade_id: id,
                project_id: project
            },
            include: [
                {model: ServiceMapping, attributes: ['name']}
            ]
        })

        return estimate
    }

    async getAllEstimateForProject(id) {
        const estimates = await EstimateMapping.findAll({
            where: {
                project_id: id
            },
            include: [
                { model: ServiceMapping, attributes: ['name'] },
                
            ]
        });
    
        // Группируем данные по brigadeId
        const groupedEstimates = estimates.reduce((acc, estimate) => {
            const brigadeId = estimate.brigadeId; 
           
    
            if (!acc[brigadeId]) {
                acc[brigadeId] = {
                    brigadeId: brigadeId,
                    estimates: []
                };
            }
    
            acc[brigadeId].estimates.push(estimate);
            return acc;
        }, {});
    
        // Преобразуем объект в массив для удобства
        const result = Object.values(groupedEstimates);

        const payments = await PaymentMapping.findAll({
            where: {
                project_id: id
            },
        });
    
        // Группируем данные по brigadeId
        const groupedPayments = payments.reduce((acc, payment) => {
            const brigadeId = payment.brigadeId;
    
            if (!acc[brigadeId]) {
                acc[brigadeId] = {
                    brigadeId: brigadeId,
                    payments: []
                };
            }
    
            // Преобразуем payment в нужный формат
            acc[brigadeId].payments.push({
                id: payment.id,
                date: payment.date,
                sum: payment.sum,
                createdAt: payment.createdAt,
                // Добавьте другие необходимые поля здесь
            });
            return acc;
        }, {});
    
        // Преобразуем объект в массив для удобства
        const resultPayment = Object.values(groupedPayments);
    
        // Объединяем результаты estimates и payments по brigadeId
        const finalResult = result.map(estimateGroup => {
            const paymentGroup = resultPayment.find(paymentGroup => paymentGroup.brigadeId === estimateGroup.brigadeId);
            
            return {
                brigadeId: estimateGroup.brigadeId,
                estimates: estimateGroup.estimates,
                payments: paymentGroup ? paymentGroup.payments : [], // Если нет платежей, возвращаем пустой массив
            };
        });
    
        return finalResult;
    }


   

    async getOne(id) {
        const estimate = await EstimateMapping.findByPk(id)
        if (!estimate) { 
            throw new Error('Строка не найдена в БД')
        }
        return estimate
    } 



    async create(data) {
        const {  projectId, serviceId, price, brigadeId} = data;
        const estimate = await EstimateMapping.create({projectId, serviceId, price, brigadeId });
        const created = await EstimateMapping.findByPk(estimate.id);
        return created;
    }

    async createEstimateBrigade(id, data) {
        const estimate = await EstimateMapping.findByPk(id) 
        if (!estimate) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            done = estimate.done
        } = data
        await estimate.update({done})
        await estimate.reload()
        return estimate
    }

   

    async updateEstimatePrice(id, data) {
        const estimate = await EstimateMapping.findByPk(id)
        if (!estimate) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            price = estimate.price,
        } = data
        await estimate.update({price})
        await estimate.reload()
        return estimate
    }

    async updateBrigadeForProject(id, project, data) {
        const { brigadeId } = data;
    
        if (!brigadeId) {
            throw new Error('Новый brigade_id не указан');
        }
    
      
        // Обновляем строки
        const estimate = await EstimateMapping.update(
            { brigadeId },
            { where: { brigadeId: id, projectId: project } }
        );
    
        // Проверяем количество обновленных строк
        if (estimate[0] === 0) {
            throw new Error('Строки не найдены для обновления');
        }
    
        return estimate;
    }
    
    async deleteEstimateBrigadeForProject(id, project) {
    
        const estimate = await EstimateMapping.destroy(
            { where: { brigadeId: id, projectId: project } }
        );
    
        
        return estimate;
    }
    
    async delete(id) {
        const estimate = await EstimateMapping.findByPk(id);
        if (!estimate) {
            throw new Error('Строка не найдена в БД');
        }
    
        await estimate.destroy();
        return estimate;
    }
    
}

export default new Estimate()