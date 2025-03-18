import { ComplaintEstimate as ComplaintEstimateMapping  } from './mapping.js';
import { ComplaintPayment as ComplaintPaymentMapping } from './mapping.js';
import { Complaint as ComplaintMapping } from './mapping.js';
import { Project as ProjectMapping } from './mapping.js';
import { Service as ServiceMapping } from './mapping.js';





class ComplaintEstimate {
    async getAll() {
        const complaint_estimate = await ComplaintEstimateMapping .findAll({})
        
          return complaint_estimate;
    }


    async getAllEstimateForComplaint(id) {
        const estimate = await ComplaintEstimateMapping .findAll({
            where: {
                complaint_id: id
            },
            include: [
                { model: ServiceMapping, attributes: ['name'] },
                
            ]
        });
    
        // Группируем данные по brigadeId
        const groupedCompaintEstimates = estimate.reduce((acc, estimate) => {
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
        const result = Object.values(groupedCompaintEstimates);

        const payments = await ComplaintPaymentMapping.findAll({
            where: {
                complaint_id: id
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
               
            });
            return acc;
        }, {});
    
        // Преобразуем объект в массив для удобства
        const resultPayment = Object.values(groupedPayments);

    
        const finalResult = result.map(complaintEstimateGroup => {
            const paymentGroup = resultPayment.find(paymentGroup => paymentGroup.brigadeId === complaintEstimateGroup.brigadeId);
            
            return {
                brigadeId: complaintEstimateGroup.brigadeId,
                estimates: complaintEstimateGroup.estimates,
                payments: paymentGroup ? paymentGroup.payments : [],
            };
        });
    
        return finalResult;
    }


    async getAllEstimateForBrigadeComplaint(id, complaint) {
        const estimate = await ComplaintEstimateMapping.findAll({
            where: {
                brigade_id: id,
                complaint_id: complaint
            },
            include: [
                {model: ServiceMapping, attributes: ['name']}
            ]
        })
    
        return estimate
    }


    async getAllComplaintEstimateForBrigadeForAllProject(id) {
        const estimates = await ComplaintEstimateMapping.findAll({
            where: {
                brigade_id: id
            },
            include: [
                { model: ServiceMapping, attributes: ['name'] },
                { model: ComplaintMapping, 
                    include: [
                       {model: ProjectMapping, attributes: ['name']} 
                    ],
                    attributes: ['note', 'date_finish']
                } 
            ]
        });
    
        const groupedEstimates = estimates.reduce((acc, estimate) => {
            const complaintId = estimate.complaintId; 
            const complaintNote = estimate.complaint.note;
            const complaintFinish = estimate.complaint.date_finish;
            const projectName = estimate.complaint.project.name
    
                if (!acc[complaintId]) {
                    acc[complaintId] = {
                        complaintId: complaintId,
                        complaintNote: complaintNote,
                        complaintFinish: complaintFinish,
                        projectName: projectName,
                        estimates: []
                    };
                }
    
                acc[complaintId].estimates.push(estimate);
            
    
            return acc;
        }, {});
    
        // Преобразуем объект в массив для удобства
        const result = Object.values(groupedEstimates);
    
        return result;
    }


   

    async getOne(id) {
        const complaint_estimate = await ComplaintEstimateMapping .findByPk(id)
        if (!complaint_estimate) { 
            throw new Error('Строка не найдена в БД')
        }
        return complaint_estimate
    } 



    async create(data) {
        const {complaintId, serviceId, price, brigadeId} = data;
        const complaint_estimate = await ComplaintEstimateMapping .create({complaintId, serviceId, price, brigadeId});
        
        const created = await ComplaintEstimateMapping .findByPk(complaint_estimate.id);
        return created;
    }

    async createEstimateBrigade(id, data) {
        const complaint_estimate = await ComplaintEstimateMapping .findByPk(id) 
        if (!complaint_estimate) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            done = complaint_estimate.done
        } = data
        await complaint_estimate.update({done})
        await complaint_estimate.reload()
        return complaint_estimate
    }

   

    async updateEstimatePrice(id, data) {
        const complaint_estimate = await ComplaintEstimateMapping .findByPk(id)
        if (!complaint_estimate) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            price = complaint_estimate.price,
        } = data
        await complaint_estimate.update({price})
        await complaint_estimate.reload()
        return complaint_estimate
    }

    async updateBrigadeForComplaint(id, complaint, data) {
        const { brigadeId } = data;
    
        if (!brigadeId) {
            throw new Error('Новый brigade_id не указан');
        }
    
      
        // Обновляем строки
        const complaint_estimate = await ComplaintEstimateMapping .update(
            { brigadeId },
            { where: { brigadeId: id, complaintId: complaint } }
        );
    
        // Проверяем количество обновленных строк
        if (complaint_estimate[0] === 0) {
            throw new Error('Строки не найдены для обновления');
        }
    
        return complaint_estimate;
    }
    
    async deleteEstimateBrigadeForComplaint(id, complaint) {
    
        const complaint_estimate= await ComplaintEstimateMapping .destroy(
            { where: { brigadeId: id, complaintId: complaint } }
        );
    
        
        return complaint_estimate;
    }
    
    async delete(id) {
        const complaint_estimate = await ComplaintEstimateMapping .findByPk(id);
        if (!complaint_estimate) {
            throw new Error('Строка не найдена в БД');
        }
    
        await complaint_estimate.destroy();
        return complaint_estimate;
    }
    
}

export default new ComplaintEstimate()