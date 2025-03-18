import { ComplaintPayment as ComplaintPaymentMapping } from "./mapping.js";

class ComplaintPayment {
    async getAll() {
        const complaint_payment = await ComplaintPaymentMapping.findAll({})
        
        return complaint_payment;
    }

    async getOne(id) {
        const complaint_payment = await ComplaintPaymentMapping.findByPk(id)
        if (!complaint_payment) { 
            throw new Error('Строка не найдена в БД')
        }
        return complaint_payment
    } 

    async create(data) {
        const {  complaintId, date, sum, brigadeId} = data;
        const comaplaint_payment = await ComplaintPaymentMapping.create({complaintId, date, sum, brigadeId });
        const created = await ComplaintPaymentMapping.findByPk(comaplaint_payment.id);
        return created;
    }

    async getAllPaymentForBrigade(id) {
        const complaint_payment = await ComplaintPaymentMapping.findAll({
            where: {
                brigade_id: id
            },
        });
    
        return complaint_payment;
    }

    async updatePaymentDate(id, data) {
        const complaint_payment = await ComplaintPaymentMapping.findByPk(id)
        if (!complaint_payment) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            date = complaint_payment.date,
        } = data
        await complaint_payment.update({date})
        await complaint_payment.reload()
        return complaint_payment
    }

    async updatePaymentSum(id, data) {
        const complaint_payment = await ComplaintPaymentMapping.findByPk(id)
        if (!complaint_payment) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            sum = complaint_payment.sum,
        } = data
        await complaint_payment.update({sum})
        await complaint_payment.reload()
        return complaint_payment
    }

    async delete(id) {
        const complaint_payment = await ComplaintPaymentMapping.findByPk(id);
        if (!complaint_payment) {
            throw new Error('Строка не найдена в БД');
        }
    
        await complaint_payment.destroy();
        return complaint_payment;
    }

}

export default new ComplaintPayment;