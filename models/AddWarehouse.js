import { AddWarehouse as AddWarehouseMapping } from "./mapping.js";
import { WarehouseAssortment as WarehouseAssortmentMapping } from "./mapping.js";

class AddWarehouse {

    async getAll() {
        const add_warehouse = await AddWarehouseMapping.findAll({
            order: [['date', 'ASC']] // Сортируем по дате
        });
        
        const groupedMap = new Map();
        
        add_warehouse.forEach(item => {
            // Форматируем дату в YYYY-MM-DD
            const dateObj = new Date(item.date);
            const dateKey = dateObj.toISOString().split('T')[0];
            
            const { warehouse_assortement_id, quantity, id } = item;
            
            if (!groupedMap.has(dateKey)) {
                groupedMap.set(dateKey, {
                    date: dateKey,
                    originalDate: item.date, // сохраняем оригинальную дату
                    props: []
                });
            }
            
            const group = groupedMap.get(dateKey);
            const existingProp = group.props.find(
                (prop) => prop.warehouse_assortement_id === warehouse_assortement_id
            );
            
            if (existingProp) {
                existingProp.quantity += quantity;
            } else {
                group.props.push({
                    id: id,
                    warehouse_assortement_id: warehouse_assortement_id,
                    quantity: quantity
                });
            }
        });
        
        const formattedData = Array.from(groupedMap.values());
        
        return formattedData;
    }

    async getOne(id) {
        const add_warehouse = await AddWarehouseMapping.findByPk(id)
        if (!add_warehouse) { 
            throw new Error('Деталь не найдена в БД')
        }
        return add_warehouse
    } 

   

    
    // получние суммы количества отдельной детали
    async getSumOneWarehouseDetail() {
        const add_warehouse = await AddWarehouseMapping.findAll()
        const result = add_warehouse.reduce((acc, item)=> {
            const {warehouse_assortement_id, quantity} = item
            const totalSum = acc.get(warehouse_assortement_id) || 0;
            acc.set(warehouse_assortement_id, totalSum + quantity);
            return acc;
        }, new Map())

        const formattedResult = Array.from(result.entries()).map(([warehouse_assortement_id, totalSum]) => ({ warehouse_assortement_id, totalSum }));
        return [{ props: formattedResult }]
    }
  
    // себестоимость по каждой детали
    async getCostPriceOneWarehouseDetail() {
        const add_warehouse = await AddWarehouseMapping.findAll();
        
        // Получаем цены всех деталей
        const detailPrices = await WarehouseAssortmentMapping.findAll({ attributes: ['id', 'price'] });
        const detailPricesMap = new Map(detailPrices.map(detail => [detail.id, detail.price]));
    
        const result = add_warehouse.reduce((acc, item) => {
            const { warehouse_assortement_id, quantity } = item;
            const totalSum = acc.get(warehouse_assortement_id) || 0;
            acc.set(warehouse_assortement_id, totalSum + quantity);
            return acc;
        }, new Map());
    
        const formattedResult = Array.from(result.entries()).map(([warehouse_assortement_id, totalSum]) => ({ warehouse_assortement_id, totalSum }));
    
        // Умножаем количество деталей на цену каждой детали
        const constPrice = formattedResult.map(({ warehouse_assortement_id, totalSum }) => ({
            warehouse_assortement_id,
      
            totalPrice: totalSum * (detailPricesMap.get(warehouse_assortement_id) || 0)
        }));
    
        return [{ props: constPrice }];
    }

    async create(data) {
        const { quantity, warehouse_assortement_id, date } = data;
      
        let existingRecord = await AddWarehouseMapping.findOne({
          where: { warehouse_assortement_id, date }
        });
      
        if (existingRecord) {
            existingRecord.quantity = parseInt(existingRecord.quantity, 10) + parseInt(quantity, 10);  // Увеличиваем количество
            await existingRecord.save();
            return existingRecord;
          
        } else {
          // Создаем новую запись только если существующей не найдено
          const add_warehouse = await AddWarehouseMapping.create({ quantity, warehouse_assortement_id, date });
          return add_warehouse;
        }
    }
    

    async update(id, data) {
        const add_warehouse = await AddWarehouseMapping.findByPk(id)
        if (!add_warehouse) {
            throw new Error('Деталь не найдена в БД')
        }
        const {
            quantity = add_warehouse.quantity
        } = data
        await add_warehouse.update({quantity})
        await add_warehouse.reload()
        return add_warehouse
    }

    async delete(stock_date) {
        const add_warehouse = await AddWarehouseMapping.findAll({ where: { date: date } })
        if (!add_warehouse || add_warehouse.length === 0) {
            throw new Error('Отметка времени не найдена')
        }
        for (const stockdetail of add_warehouse) {
            await stockdetail.destroy()
        }
        return add_warehouse
    }

  

}

export default new AddWarehouse()