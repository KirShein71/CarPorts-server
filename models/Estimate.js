import {Estimate as EstimateMapping} from './mapping.js'
import { Service as ServiceMapping } from './mapping.js';
import { Project as ProjectMapping } from './mapping.js';
import { Payment as PaymentMapping} from './mapping.js'
import { Brigade as BrigadeMapping } from './mapping.js';




class Estimate {
    async getAll() {
        const estimate = await EstimateMapping.findAll({})
        
          return estimate;
    }

    async getAllEstimatesForAllProjects() {
        const projects = await ProjectMapping.findAll();
        const activeProjectIds = projects
            .filter((project) => project.finish === null)
            .map((project) => project.id); // Получаем массив ID активных проектов
    
        const [estimates, payments] = await Promise.all([
            EstimateMapping.findAll({
                include: [
                    { model: ProjectMapping, attributes: ['name'] },
                    { model: BrigadeMapping, attributes: ['name'] },
                ]
            }),
            PaymentMapping.findAll({
                include: [
                    { model: ProjectMapping, attributes: ['name'] },
                    { model: BrigadeMapping, attributes: ['name'] },
                ]
            })
        ]);
        
        // Группируем данные по projectId для оценок
        const groupedEstimates = estimates.reduce((acc, estimate) => {
            const projectId = estimate.projectId; 
            const projectName = estimate.project.name; 
            const brigadeId = estimate.brigadeId; 
            const brigadeName = estimate.brigade.name; 
    
            if (!acc[projectId]) {
                acc[projectId] = {
                    projectId: projectId,
                    projectName: projectName,
                    brigades: {},
                    totalPrice: 0, // Общая сумма всех оценок
                    totalSumDone: 0 // Сумма только тех оценок, где done === true
                };
            }
    
            // Суммируем все оценки
            acc[projectId].totalPrice += estimate.price;
    
            // Суммируем только оценки, где done === true
            if (estimate.done === 'true') {
                acc[projectId].totalSumDone += estimate.price;
            }
    
            if (!acc[projectId].brigades[brigadeId]) {
                acc[projectId].brigades[brigadeId] = {
                    brigadeId: brigadeId,
                    brigadeName: brigadeName,
                    estimates: []
                };
            }
    
            acc[projectId].brigades[brigadeId].estimates.push(estimate);
            
            return acc;
        }, {});
        
        // Группируем данные по projectId для платежей
        const groupedPayments = payments.reduce((acc, payment) => {
            const projectId = payment.projectId; 
            const projectName = payment.project.name; 
            const brigadeId = payment.brigadeId; 
            const brigadeName = payment.brigade.name; 
    
            if (!acc[projectId]) {
                acc[projectId] = {
                    projectId: projectId,
                    projectName: projectName,
                    brigades: {},
                    totalPaymentSum: 0 // Сумма sum для платежей
                };
            }
    
            acc[projectId].totalPaymentSum += payment.sum; // Суммируем sum
    
            if (!acc[projectId].brigades[brigadeId]) {
                acc[projectId].brigades[brigadeId] = {
                    brigadeId: brigadeId,
                    brigadeName: brigadeName,
                    payments: []
                };
            }
    
            acc[projectId].brigades[brigadeId].payments.push(payment);
            
            return acc;
        }, {});
        
        // Объединяем результаты и фильтруем по активным проектам
        const combinedResult = Object.values(groupedEstimates)
            .filter(project => activeProjectIds.includes(project.projectId)) // Фильтруем только активные проекты
            .map(project => {
                const paymentsForProject = groupedPayments[project.projectId]?.brigades || {};
            
                // Объединяем оценки и платежи по бригадам
                const brigadesWithPayments = Object.values(project.brigades).map(brigade => {
                    return {
                        ...brigade,
                        payments: paymentsForProject[brigade.brigadeId]?.payments || []
                    };
                });
            
                return {
                    projectId: project.projectId,
                    projectName: project.projectName,
                    totalPrice: project.totalPrice, // Общая сумма всех оценок
                    totalSumDone: project.totalSumDone, // Сумма оценок, где done === true
                    totalPaymentSum: groupedPayments[project.projectId]?.totalPaymentSum || 0, // Сумма всех платежей
                    brigades: brigadesWithPayments
            };
        });
    
    return combinedResult;
}

    async getAllEstimateForBrigade(id) {
        const estimates = await EstimateMapping.findAll({
            where: {
                brigade_id: id
            },
            include: [
                { model: ServiceMapping, attributes: ['name'] },
                { model: ProjectMapping, attributes: ['name', 'finish', 'installation_billing'] } 
            ]
        });
    
        const groupedEstimates = estimates.reduce((acc, estimate) => {
            const projectId = estimate.projectId; // Получаем id проекта
            const projectName = estimate.project.name; // Получаем название проекта
            const projectFinish = estimate.project.finish;
            const installationBilling = estimate.project.installation_billing
    
            // Проверяем, если projectFinish равен null
           
                if (!acc[projectId]) {
                    acc[projectId] = {
                        projectId: projectId,
                        projectName: projectName, 
                        projectFinish: projectFinish,
                        installationBilling: installationBilling,
                        estimates: []
                    };
                }
    
                acc[projectId].estimates.push(estimate);
          
    
            return acc;
        }, {});
    
        // Преобразуем объект в массив для удобства
        const result = Object.values(groupedEstimates);
    
        return result;
    }

    async getAllEstimateForBrigadeAllProject(id) {
        const estimates = await EstimateMapping.findAll({
            where: {
                brigade_id: id
            },
            include: [
                { model: ServiceMapping, attributes: ['name'] },
                { model: ProjectMapping, attributes: ['name', 'installation_billing'] } 
            ]
        });
    
        const groupedEstimates = estimates.reduce((acc, estimate) => {
            const projectId = estimate.projectId; // Получаем id проекта
            const projectName = estimate.project.name; // Получаем название проекта
            const installationBilling = estimate.project.installation_billing
    
            // Проверяем, если projectFinish равен null
                if (!acc[projectId]) {
                    acc[projectId] = {
                        projectId: projectId,
                        projectName: projectName, // Добавляем название проекта
                        installationBilling: installationBilling,
                        estimates: []
                    };
                }
    
                acc[projectId].estimates.push(estimate);
            
    
            return acc;
        }, {});
    
        // Преобразуем объект в массив для удобства
        const result = Object.values(groupedEstimates);
    
        return result;
    }

    async getAllEstimateForBrigadeFinishProject(id) {
        const estimates = await EstimateMapping.findAll({
            where: {
                brigade_id: id
            },
            include: [
                { model: ServiceMapping, attributes: ['name'] },
                { model: ProjectMapping, attributes: ['name', 'finish', 'installation_billing'] } 
            ]
        });
    
        const groupedEstimates = estimates.reduce((acc, estimate) => {
            const projectId = estimate.projectId; // Получаем id проекта
            const projectName = estimate.project.name; // Получаем название проекта
            const projectFinish = estimate.project.finish;
            const installationBilling = estimate.project.installation_billing
    
            // Проверяем, если projectFinish равен null
            if (projectFinish !== null) {
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