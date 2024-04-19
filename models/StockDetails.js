import { StockDetails as StockDetailsMapping } from './mapping.js'
import { StockAntypical as StockAntypicalMapping } from './mapping.js';
import { Detail as DetailMapping } from './mapping.js';




class StockDetails {

    async getAll() {
        const stockdetails = await StockDetailsMapping.findAll({
            include: [
                {
                    model: StockAntypicalMapping,
                    attributes: ['antypical_quantity', 'id'],
                },
            ],
            order: [
                ['stock_date', 'ASC'],
            ],
        });
    
        const formattedData = stockdetails.reduce((acc, item) => {
            const { stock_date, detailId, stock_quantity, id, StockAntypicalMapping } = item;
            const existingProject = acc.find((el) => el.stock_date === stock_date);
            if (existingProject) {
                existingProject.props.push({ id: id, detailId: detailId, stock_quantity });
                if (StockAntypicalMapping) {
                    existingProject.antypical.push({ antypical_quantity: StockAntypicalMapping.antypical_quantity, id: StockAntypicalMapping.id });
                }
            } else {
                acc.push({
                    stock_date,
                    props: [{ id, detailId, stock_quantity }],
                    antypical: StockAntypicalMapping ? [{ antypical_quantity: StockAntypicalMapping.antypical_quantity, id: StockAntypicalMapping.id }] : [],
                });
            }
            return acc;
        }, []);
    
        return formattedData;
    }
    async getOne(id) {
        const stockdetails = await StockDetailsMapping.findByPk(id)
        if (!stockdetails) { 
            throw new Error('Товар не найден в БД')
        }
        return stockdetails
    } 

   

    
    // получние суммы количества отдельной детали
    async getSumOneDetail() {
        const stockdetails = await StockDetailsMapping.findAll()
        const result = stockdetails.reduce((acc, item)=> {
            const {detailId, stock_quantity} = item
            const totalSum = acc.get(detailId) || 0;
            acc.set(detailId, totalSum + stock_quantity);
            return acc;
        }, new Map())

        const formattedResult = Array.from(result.entries()).map(([detailId, totalSum]) => ({ detailId, totalSum }));
        return [{ props: formattedResult }]
    }
  
    // себестоимость по каждой детали
    async getCostPriceOneDetail() {
        const stockdetails = await StockDetailsMapping.findAll();
        
        // Получаем цены всех деталей
        const detailPrices = await DetailMapping.findAll({ attributes: ['id', 'price'] });
        const detailPricesMap = new Map(detailPrices.map(detail => [detail.id, detail.price]));
    
        const result = stockdetails.reduce((acc, item) => {
            const { detailId, stock_quantity } = item;
            const totalSum = acc.get(detailId) || 0;
            acc.set(detailId, totalSum + stock_quantity);
            return acc;
        }, new Map());
    
        const formattedResult = Array.from(result.entries()).map(([detailId, totalSum]) => ({ detailId, totalSum }));
    
        // Умножаем количество деталей на цену каждой детали
        const constPrice = formattedResult.map(({ detailId, totalSum }) => ({
            detailId,
      
            totalPrice: totalSum * (detailPricesMap.get(detailId) || 0)
        }));
    
        return [{ props: constPrice }];
    }

    async create(data) {
        const { stock_quantity, detailId, stock_date } = data;
        const stockdetails = await StockDetailsMapping.create({ stock_quantity, detailId, stock_date });
        const created = await StockDetailsMapping.findByPk(stockdetails.id);
        return created;
    }


    async update(id, data) {
        const stockdetails = await StockDetailsMapping.findByPk(id)
        if (!stockdetails) {
            throw new Error('Товар не найден в БД')
        }
        const {
            stock_quantity = stockdetails.stock_quantity
        } = data
        await stockdetails.update({stock_quantity})
        await stockdetails.reload()
        return stockdetails
    }

    async delete(stock_date) {
        const stockdetails = await StockDetailsMapping.findAll({ where: { stock_date: stock_date } })
        if (!stockdetails || stockdetails.length === 0) {
            throw new Error('Отметка времени не найдена')
        }
        for (const stockdetail of stockdetails) {
            await stockdetail.destroy()
        }
        return stockdetails
    }

  

}

export default new StockDetails()