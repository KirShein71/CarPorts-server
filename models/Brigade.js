import { Brigade as BrigadeMapping } from "./mapping.js";
import { Region as RegionMapping} from './mapping.js'
import FileService from '../services/File.js'

class Brigade {
    async getAll() {
        const brigades = await BrigadeMapping.findAll({
            include: [{model: RegionMapping, attributes: ['region']}]
        })
        return brigades
    }

    async getAllActiveBrigade() {
        const brigades = await BrigadeMapping.findAll({
            where: {
                active: 'true'
            },
            attributes: ['id', 'name', 'regionId'],
            
        })
        return brigades
    }

    async getOne(id) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Бригада не найдена в БД')
        }
        return brigade
    }

    async getByPhone(phone) {
        const brigade = await BrigadeMapping.findOne({where: {phone}})
        if (!brigade) {
            throw new Error('Пользователь не найден в БД')
        }
        return brigade
    }

    async create(data, img) {
        const {
            name, phone, regionId, role, password, active,
            full_name, seria_number, issue_date, issued_by,
            car_brand, car_color, license_plate
        } = data;
        
        const image = FileService.save(img) || '';
        
        // Проверка на существование
        const check = await BrigadeMapping.findOne({ where: { phone } });
        if (check) {
            throw new Error('Бригада уже существует');
        }
        
        // Обработка даты
        let formattedIssueDate = null;
        if (issue_date && issue_date !== '' && issue_date !== 'null') {
            const date = new Date(issue_date);
            if (!isNaN(date.getTime())) {
                formattedIssueDate = date;
            }
        }
        
        const brigade = await BrigadeMapping.create({
            name,
            phone,
            image,
            regionId: regionId || null,
            role: role || 'INSTALLER',
            password, 
            active: active === 'true',
            full_name: full_name || null,
            seria_number: seria_number || null,
            issue_date: formattedIssueDate,
            issued_by: issued_by || null,
            car_brand: car_brand || null,
            car_color: car_color || null,
            license_plate: license_plate || null
        });
        
        const created = await BrigadeMapping.findByPk(brigade.id);
        return created;
    }

    async update(id, data, img) {
        const brigade = await BrigadeMapping.findByPk(id);
        if (!brigade) {
            throw new Error('Бригада не найдена в БД');
        }
        
        // Обработка изображения
        let imagePath = brigade.image;
        if (img) {
            const file = FileService.save(img);
            if (file) {
                // Удаляем старое изображение, только если оно существует
                if (brigade.image) {
                    FileService.delete(brigade.image);
                }
                imagePath = file;
            }
        }
        
        // Деструктуризация с значениями по умолчанию
        const {
            name = brigade.name,
            phone = brigade.phone,
            full_name = brigade.full_name,
            seria_number = brigade.seria_number,
            issue_date = brigade.issue_date,
            issued_by = brigade.issued_by,
            car_brand = brigade.car_brand,
            car_color = brigade.car_color,
            license_plate = brigade.license_plate
        } = data;
        
        // Обработка даты
        let formattedIssueDate = issue_date;
        if (issue_date && issue_date !== '' && issue_date !== 'null') {
            const date = new Date(issue_date);
            if (!isNaN(date.getTime())) {
                formattedIssueDate = date;
            } else {
                formattedIssueDate = null;
            }
        } else {
            formattedIssueDate = null;
        }
        
        await brigade.update({
            name,
            phone,
            image: imagePath,
            full_name: full_name || null,
            seria_number: seria_number || null,
            issue_date: formattedIssueDate,
            issued_by: issued_by || null,
            car_brand: car_brand || null,
            car_color: car_color || null,
            license_plate: license_plate || null
        });
        
        await brigade.reload();
        return brigade;
    }

    async updateActiveBrigade(id, data) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Бригада не найдена в БД')
        }
        
        const {
            active = brigade.active
            
        } = data
        await brigade.update({active})
        await brigade.reload()
        return brigade
    }

    async updateBrigadeName(id, data) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Бригада не найдена в БД')
        }
        const {
            name = brigade.name,
            
        } = data
        await brigade.update({name})
        await brigade.reload()
        return brigade
    }

    async updateBrigadePhone(id, data) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Бригада не найдена в БД')
        }
        const {
            phone = brigade.phone,
            
        } = data
        await brigade.update({phone})
        await brigade.reload()
        return brigade
    }

    async createPassword(id, data) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Бригада не найдена в БД')
        }
    
        const {
            password = brigade.password
            
        } = data
        await brigade.update({password})
        await brigade.reload()
        return brigade
    }


    async createRegion(id, data) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Бригада не найдена в БД')
        }
        const {
            regionId = brigade.regionId,
        } = data
        await brigade.update({regionId})
        await brigade.reload()
        return brigade
    }

    async delete(id) {
        const brigade = await BrigadeMapping.findByPk(id)
        if (!brigade) {
            throw new Error('Бригада не найдена в БД')
        }
        await brigade.destroy()
        return brigade
    }
}

export default new Brigade()