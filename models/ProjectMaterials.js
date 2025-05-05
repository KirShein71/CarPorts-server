import { ProjectMaterials as ProjectMaterialsMapping, Supplier } from './mapping.js'
import { Project as ProjectMapping } from './mapping.js'
import { Material as MaterialMapping} from './mapping.js'
import {Supplier as SupplierMapping} from './mapping.js'
import { Op } from 'sequelize'



class ProjectMaterials {
    async getAll() {
        const projectsmaterials = await ProjectMaterialsMapping.findAll({
            include: [
                {
                  model: ProjectMapping,
                  attributes: ['name', 'number', 'expiration_date', 'agreement_date', 'design_period', 'id'],
                  where: {
                    finish: null
                }
                },
                 
                {
                  model: MaterialMapping,
                        attributes: ['name']}
                  
              ],

              order: [
                ['projectId', 'DESC']
              ]
        })

        const formattedData = projectsmaterials.reduce((acc, item) => {
            const { projectId, materialId, materialName, date_payment, ready_date, shipping_date, check, color, project, id } = item;
            const existingProject = acc.find((project) => project.projectId === projectId);
            if (existingProject) {
              existingProject.props.push({ id: id, materialId: materialId, materialName: materialName, date_payment: date_payment, ready_date: ready_date, shipping_date: shipping_date, check: check, color: color });
            } else {
              acc.push({
                id: project.id,
                name: project.name,
                number: project.number,
                expiration_date: project.expiration_date,
                agreement_date: project.agreement_date,
                design_period: project.design_period,
                projectId: projectId,
                props: [{ id:id, materialId: materialId, materialName: materialName, date_payment: date_payment,  ready_date: ready_date, shipping_date: shipping_date, check: check, color: color }]
              });
            }
            return acc;
          }, []);
        
          return formattedData;
    }

    async getAllMaterialProject() {
        const projectsmaterials = await ProjectMaterialsMapping.findAll({
            include: [
                {
                  model: ProjectMapping,
                  attributes: ['name', 'number', 'expiration_date', 'agreement_date', 'design_period', 'id'],
                  where: {
                    finish: null
                }
                },
                 
                {
                  model: MaterialMapping,
                        attributes: ['name']}
                  
              ],

              order: [
                ['materialId', 'DESC']
              ]
        })

        const formattedData = projectsmaterials.reduce((acc, item) => {
            const { materialId, materialName, date_payment, ready_date, shipping_date, check, color, project, id } = item;
            const existingProject = acc.find((material) => material.materialId === materialId);
            if (existingProject) {
              existingProject.props.push({ id: id, name: project.name, number: project.number, expiration_date: project.expiration_date, agreement_date: project.agreement_date, design_period: project.design_period,  date_payment: date_payment, ready_date: ready_date, shipping_date: shipping_date, check: check, color: color });
            } else {
              acc.push({
                materialId: materialId,
                materialName: materialName,
                props: [{ id:id, name: project.name, number: project.number, expiration_date: project.expiration_date, agreement_date: project.agreement_date, design_period: project.design_period, date_payment: date_payment,  ready_date: ready_date, shipping_date: shipping_date, check: check, color: color }]
              });
            }
            return acc;
          }, []);
        
          return formattedData;
    }

    async getAllProjectMaterialForLogistic() {
        // Получаем текущую дату и устанавливаем время на 00:00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Создаем диапазон дат (вчера, сегодня, +2 дня)
        const dateRange = {
            start: new Date(today),
            end: new Date(today)
        };
        dateRange.start.setDate(dateRange.start.getDate() - 1); // Вчера
        dateRange.end.setDate(dateRange.end.getDate() + 2);     // +2 дня от сегодня
        
        const projectsmaterials = await ProjectMaterialsMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name', 'number', 'id', 'regionId'],
                    where: {
                        finish: null
                    }
                },
            ],
            where: {
                shipping_date: {
                    [Op.ne]: null, // shipping_date не равен null
                    [Op.between]: [dateRange.start, dateRange.end] // В диапазоне дат
                }
            }
        });
    
        // Создаем структуру для группировки: проект -> дата -> материалы
        const groupedData = projectsmaterials.reduce((acc, item) => {
            const { projectId, materialId, materialName, shipping_date, check, weight, dimensions, project, id } = item;
            
            // Проверяем, что дата отгрузки попадает в нужный диапазон
            const shippingDate = new Date(shipping_date);
            shippingDate.setHours(0, 0, 0, 0); // Нормализуем дату
            
            if (shippingDate >= dateRange.start && shippingDate <= dateRange.end) {
                const dateStr = shippingDate.toISOString().split('T')[0]; // Формат YYYY-MM-DD
                
                // Находим или создаем проект
                let projectEntry = acc.find(p => p.projectId === projectId);
                if (!projectEntry) {
                    projectEntry = {
                        id: project.id,
                        name: project.name,
                        number: project.number,
                        regionId: project.regionId,
                        projectId: projectId,
                        dates: {} // Объект для хранения данных по датам
                    };
                    acc.push(projectEntry);
                }
                
                // Находим или создаем запись для даты
                if (!projectEntry.dates[dateStr]) {
                    projectEntry.dates[dateStr] = {
                        date: dateStr,
                        displayDate: this.getDisplayDate(shippingDate),
                        props: []
                    };
                }
                
                // Добавляем материал
                projectEntry.dates[dateStr].props.push({ 
                    id: id, 
                    materialId: materialId, 
                    materialName: materialName, 
                    shipping_date: shipping_date,
                    check: check,
                    weight: weight,
                    dimensions: dimensions
                });
            }
            return acc;
        }, []);
        
        // Преобразуем объект dates в массив и сортируем даты в нужном порядке
        const formattedData = groupedData.map(project => {
            // Преобразуем объект dates в массив
            const datesArray = Object.values(project.dates);
            
            // Сортируем даты в порядке: сегодня+2, сегодня+1, сегодня, вчера
            datesArray.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA; // Сортировка от новых к старым
            });
            
            return {
                ...project,
                dates: datesArray
            };
        });
        
        return formattedData;
    }

    async getAllMaterialProjectForLogistic() {
        // Получаем текущую дату и устанавливаем время на 00:00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Создаем диапазон дат (вчера, сегодня, +2 дня)
        const dateRange = {
            start: new Date(today),
            end: new Date(today)
        };
        dateRange.start.setDate(dateRange.start.getDate() - 1); // Вчера
        dateRange.end.setDate(dateRange.end.getDate() + 2);     // +2 дня от сегодня
        
        const projectsmaterials = await ProjectMaterialsMapping.findAll({
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['name', 'number', 'id', 'regionId'],
                    where: {
                        finish: null
                    }
                },
            ],
            where: {
                shipping_date: {
                    [Op.ne]: null, // shipping_date не равен null
                    [Op.between]: [dateRange.start, dateRange.end] // В диапазоне дат
                }
            }
        });

   
 
        // Создаем структуру для группировки: проект -> дата -> материалы
        const groupedData = projectsmaterials.reduce((acc, item) => {
            const { projectId, materialId, materialName, shipping_date, check, weight, dimensions, project, id } = item;
            
            // Проверяем, что дата отгрузки попадает в нужный диапазон
            const shippingDate = new Date(shipping_date);
            shippingDate.setHours(0, 0, 0, 0); // Нормализуем дату
            
            if (shippingDate >= dateRange.start && shippingDate <= dateRange.end) {
                const dateStr = shippingDate.toISOString().split('T')[0]; // Формат YYYY-MM-DD
                
                // Находим или создаем проект
                let materialEntry = acc.find(p => p.materialId === materialId);
                if (!materialEntry) {
                    materialEntry = {
                        materialId: materialId, 
                        materialName: materialName,
                        dates: {} // Объект для хранения данных по датам
                    };
                    acc.push(materialEntry);
                }
                
                // Находим или создаем запись для даты
                if (!materialEntry.dates[dateStr]) {
                    materialEntry.dates[dateStr] = {
                        date: dateStr,
                        displayDate: this.getDisplayDate(shippingDate),
                        props: []
                    };
                }
                
                // Добавляем материал
                materialEntry.dates[dateStr].props.push({ 
                    id: id, 
                    name: project.name,
                    number: project.number,
                    regionId: project.regionId,
                    projectId: projectId,
                    shipping_date: shipping_date,
                    check: check,
                    weight: weight,
                    dimensions: dimensions
                });
            }
            return acc;
        }, []);
        
        // Преобразуем объект dates в массив и сортируем даты в нужном порядке
        const formattedData = groupedData.map(project => {
            // Преобразуем объект dates в массив
            const datesArray = Object.values(project.dates);
            
            // Сортируем даты в порядке: сегодня+2, сегодня+1, сегодня, вчера
            datesArray.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA; // Сортировка от новых к старым
            });
            
            return {
                ...project,
                dates: datesArray
            };
        });
        
        return formattedData;
    }

    async getPickupMaterialsForLogistic(date) { 
        const projectmaterials = await ProjectMaterialsMapping.findAll({
            where: {
                shipping_date: date
            },
            include: [
                {
                    model: SupplierMapping
                },
                {
                    model: ProjectMapping, attributes: ['name', 'regionId']
                }
            ]
        });
    
        if (!projectmaterials || projectmaterials.length === 0) { 
            throw new Error('Товар не найден в БД');
        }
    
        const formattedData = projectmaterials.reduce((acc, item) => {
            const { supplierId, materialId, materialName, id, supplier, project, weight, dimensions } = item;
            const existingSupplier = acc.find((supplier) => supplier.supplierId === supplierId);
            
            if (existingSupplier) {
                existingSupplier.props.push({ id: id, materialId: materialId, materialName: materialName });
                existingSupplier.projects.push({ name: project.name, region: project.regionId });
                existingSupplier.weight += weight; // Суммируем вес
                existingSupplier.dimensions = Math.max(existingSupplier.dimensions, dimensions); // Находим максимальное значение размеров
            } else {
                acc.push({
                    id: supplier.id,
                    name: supplier.name,
                    contact: supplier.contact,
                    address: supplier.address,
                    shipment: supplier.shipment,
                    note: supplier.note,
                    navigator: supplier.navigator,
                    coordinates: supplier.coordinates,
                    supplierId: supplierId, 
                    weight: weight, // Инициализируем вес
                    dimensions: dimensions, // Инициализируем размеры
                    props: [{ id: id, materialId: materialId, materialName: materialName }],
                    projects: [{ name: project.name, region: project.regionId }]
                });
            }
            return acc;
        }, []);
        
        return formattedData;
    }



    // Вспомогательная функция для получения отображаемого названия даты
    getDisplayDate(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((date - today) / (1000 * 60 * 60 * 24));
        
        switch(diffDays) {
            case 0: return 'Сегодня';
            case 1: return 'Завтра';
            case 2: return 'Послезавтра';
            case -1: return 'Вчера';
            default: return date.toLocaleDateString('ru-RU');
        }
    }
    
    async getOne(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) { 
            throw new Error('Товар не найден в БД')
        }
        return projectmaterials
    } 

    async create(data) {
        
        const { date_payment, expirationMaterial_date, ready_date, shipping_date, check, color, projectId, materialId, materialName, supplierId } = data;
       
        const projectmaterials = await ProjectMaterialsMapping.create({ date_payment, expirationMaterial_date, ready_date, shipping_date, check, color, projectId, materialId, materialName, supplierId });
        const created = await ProjectMaterialsMapping.findByPk(projectmaterials.id);
        return created;
    }

   

      async createCheckProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД')
        }
        const {
            check = projectmaterials.check
        } = data
        await projectmaterials.update({check})
        await projectmaterials.reload()
        return projectmaterials
    }

    async deleteCheckProjectMaterials(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
        await projectmaterials.update({ check: null });
        return projectmaterials;
    }
    


    async createReadyDateProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            ready_date = projectmaterials.ready_date
        } = data
        await projectmaterials.update({ready_date})
        await projectmaterials.reload()
        return projectmaterials
    }

    async deleteReadyDateProjectMaterials(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
        await projectmaterials.update({ ready_date: null });
        return projectmaterials;
    }

    async createShippingDateProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            shipping_date = projectmaterials.shipping_date
        } = data
        await projectmaterials.update({shipping_date})
        await projectmaterials.reload()
        return projectmaterials
    }

    async deleteShippingDateProjectMaterials(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
        await projectmaterials.update({ shipping_date: null });
        return projectmaterials;
    }

    async createPaymentDateProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            date_payment = projectmaterials.date_payment
        } = data
        await projectmaterials.update({date_payment})
        await projectmaterials.reload()
        return projectmaterials
    }


    async deletePaymentDateProjectMaterials(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
        await projectmaterials.update({ date_payment: null });
        return projectmaterials;
    }

    async createColorProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            color = projectmaterials.color
        } = data
        await projectmaterials.update({color})
        await projectmaterials.reload()
        return projectmaterials
    }

    async createExpirationMaterialDateProjectMaterials(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            expirationMaterial_date = projectmaterials.expirationMaterial_date
        } = data
        await projectmaterials.update({expirationMaterial_date})
        await projectmaterials.reload()
        return projectmaterials
    }

    async createWeightMaterial(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            weight = projectmaterials.weight
        } = data
        await projectmaterials.update({weight})
        await projectmaterials.reload()
        return projectmaterials
    }

    async createDimensionsMaterial(id, data) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id)
        if (!projectmaterials) {
            throw new Error('Товар не найден в БД')
        }
        const {
            dimensions = projectmaterials.dimensions
        } = data
        await projectmaterials.update({dimensions})
        await projectmaterials.reload()
        return projectmaterials
    }

    async delete(id) {
        const projectmaterials = await ProjectMaterialsMapping.findByPk(id);
        if (!projectmaterials) {
            throw new Error('Строка не найдена в БД');
        }
    
        await projectmaterials.destroy();
        return projectmaterials;
    }

}

export default new ProjectMaterials()