import { StockAntypical as StockAntypicalMapping } from "./mapping.js";




class StockAntypical {
    async getOne(id) {
        const stockantypical = await StockAntypicalMapping.findByPk(id)
        if (!stockantypical) { 
            throw new Error('Товар не найден в БД')
        }
        return stockantypical
    } 

    async create(data) {
        const { antypical_quantity,  stock_date } = data;
        const stockantypical = await StockAntypicalMapping.create({ antypical_quantity, stock_date });
        const created = await StockAntypicalMapping.findByPk(stockantypical.id);
        return created;
    }


    async update(id, data) {
        const stockantypical = await StockDetailsMapping.findByPk(id)
        if (!stockantypical) {
            throw new Error('Товар не найден в БД')
        }
        const {
            stock_quantity = stockantypical.stock_quantity
        } = data
        await stockantypical.update({stock_quantity})
        await stockantypical.reload()
        return stockantypical
    }
}

export default new StockAntypical()