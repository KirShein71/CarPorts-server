import { Payment as PaymentMapping } from "./mapping.js";
import { ComplaintPayment as ComplaintPaymentMapping } from "./mapping.js";

class Payment {
    async getAll() {
        const payment = await PaymentMapping.findAll({})
        
          return payment;
    }

    async getOne(id) {
        const payment = await PaymentMapping.findByPk(id)
        if (!payment) { 
            throw new Error('Строка не найдена в БД')
        }
        return payment
    } 

    async create(data) {
        const {  projectId, date, sum, brigadeId} = data;
        const payment = await PaymentMapping.create({projectId, date, sum, brigadeId });
        const created = await PaymentMapping.findByPk(payment.id);
        return created;
    }

    async getAllPaymentForBrigade(id) {
        const payment = await PaymentMapping.findAll({
            where: {
                brigade_id: id
            },
        });

        const complaintPayment = await ComplaintPaymentMapping.findAll({
            where: {
                brigade_id: id
            },
        });

        const result = [...payment, ...complaintPayment]
    
        return result;
    }

    async updatePaymentDate(id, data) {
        const payment = await PaymentMapping.findByPk(id)
        if (!payment) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            date = payment.date,
        } = data
        await payment.update({date})
        await payment.reload()
        return payment
    }

    async updatePaymentSum(id, data) {
        const payment = await PaymentMapping.findByPk(id)
        if (!payment) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            sum = payment.sum,
        } = data
        await payment.update({sum})
        await payment.reload()
        return payment
    }

    async delete(id) {
        const payment = await PaymentMapping.findByPk(id);
        if (!payment) {
            throw new Error('Строка не найдена в БД');
        }
    
        await payment.destroy();
        return payment;
    }

}

export default new Payment;