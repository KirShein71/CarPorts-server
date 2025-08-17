import {  User as UserMapping } from "./mapping.js";
import { Project as ProjectMapping } from "./mapping.js";
import { Employee as EmployeeMapping } from "./mapping.js";
import { Admin as AdminMapping } from "./mapping.js";
import { UserFile as UserFileMapping } from "./mapping.js";
import { UserImage as UserImageMapping } from "./mapping.js";
import { Brigade as BrigadeMapping } from "./mapping.js";
import { ManagerSale as ManagerSaleMapping } from "./mapping.js";
import { ManagerProject as ManagerProjectMapping } from "./mapping.js";
import { ManagerProduction as ManagerProductionMapping } from "./mapping.js";
import {ProjectMaterials as ProjectMaterialsMappping} from './mapping.js'
import {Constructor as ConstructorMapping} from './mapping.js'
import FileService from '../services/File.js'

class User {
    async getAll() {
        const users = await UserMapping.findAll({
            include: [
                {model: ProjectMapping,
                attributes: ['number', 'name'],
            where: {
                finish: null
            }
        },
            ]
        })
        return users
    }
    
    async getOne(id) {
            const user = await UserMapping.findByPk(id, {
              include: [
                {
                  model: ProjectMapping,
                  attributes: ['number', 'name', 'agreement_date', 'design_period', 'expiration_date', 'installation_period']
                },
                {
                    
                    model: BrigadeMapping, attributes: ['name', 'phone', 'image']
                },
                {
                    
                    model: EmployeeMapping, attributes: ['name', 'phone']
                },
                {
                    
                    model: ManagerProjectMapping, attributes: ['name', 'phone']
                },
              ],
            });
            if (!user) {
              throw new Error('Пользователь не найден в БД');
            }
            return user;
          }

    async getByPhone(phone) {
            let user = await UserMapping.findOne({ where: { phone } });
            if (!user) {
                user = await EmployeeMapping.findOne({ where: { phone } });
            }
            if (!user) {
                user = await AdminMapping.findOne({ where: { phone } });
            }
            if (!user) {
                user = await BrigadeMapping.findOne({ where: { phone } });
            }
            if (!user) {
                user = await ManagerSaleMapping.findOne({ where: { phone } });
            }
            if (!user) {
                user = await ManagerProjectMapping.findOne({ where: { phone } });
            }
            if (!user) {
                user = await ConstructorMapping.findOne({ where: { phone } });
            }
            if (!user) {
                user = await ManagerProductionMapping.findOne({ where: { phone } });
            }
            if (!user) {
                throw new Error('Личный кабинет еще не создан');
        }
            return user;
    }

    async getOneAccount(id) {
        const user = await UserMapping.findByPk(id, {
          include: [
            {
              model: ProjectMapping,
              attributes: ['number', 'name', 'agreement_date', 'design_period', 'expiration_date', 'installation_period', 'design_start', 'project_delivery' , 'date_inspection'],
              include: [
                { 
                    model: ProjectMaterialsMappping, 
                    attributes: ['materialId', 'material_name', 'date_payment', 'shipping_date']
                }
              ]
            },
            {
                model: BrigadeMapping,
                attributes: ['name', 'phone', 'image']
            },
            {
                model: UserFileMapping,
                attributes: ['name', 'file']
            },
            {
                model: UserImageMapping,
                attributes: ['image', 'date']
            },
            {
                    
                model: EmployeeMapping, attributes: ['name', 'phone']
            },
            {
                    
                model: ManagerProjectMapping, attributes: ['name', 'phone']
            },
          ],
        });
        if (!user) {
          throw new Error('Пользователь не найден в БД');
        }
        return user;
      }

      async getOneAccountByToken(token) {
        const user = await UserMapping.findOne({
            where: { temporary_token: token },
            include: [
                {
                    model: ProjectMapping,
                    attributes: ['number', 'name', 'agreement_date', 'design_period', 'expiration_date', 'installation_period', 'design_start', 'project_delivery', 'date_inspection'],
                    include: [
                        { 
                            model: ProjectMaterialsMappping, 
                            attributes: ['materialId', 'material_name', 'date_payment', 'shipping_date']
                        }
                    ]
                },
                {
                    model: BrigadeMapping,
                    attributes: ['name', 'phone', 'image']
                },
                {
                    model: UserFileMapping,
                    attributes: ['name', 'file']
                },
                {
                    model: UserImageMapping,
                    attributes: ['image', 'date']
                },
                {
                    model: EmployeeMapping,
                    attributes: ['name', 'phone']
                },
                {
                    model: ManagerProjectMapping,
                    attributes: ['name', 'phone']
                },
            ],
        });

        if (!user) {
            throw new Error('Пользователь не найден по данному токену');
        }

        return user;
    }

      async getUserForBrigade(projectId) {
        const user = await UserMapping.findOne({
            where: {
                projectId: projectId
            }
        })
        return user ? user.id : null;
    }

    async create(data) {
        const {phone, role, password, projectId} = data
        const check = await UserMapping.findOne({where: {phone}})
        if (check) {
            throw new Error('Пользователь уже существует')
        }
        const user = await UserMapping.create({phone, role, projectId, password})
        return user
    }

    async createManager(id, data) {
        const user = await UserMapping.findByPk(id)
        if (!user) {
            throw new Error('Пользователь не найден в БД')
        }
        const {
            managerProjectId = user.managerProjectId,
        } = data
     
        await user.update({managerProjectId})
        await user.reload()
        return user
    }

    async createBrigade(id, data) {
        const user = await UserMapping.findByPk(id)
        if (!user) {
            throw new Error('Пользователь не найден в БД')
        }
        const {
            brigadeId = user.brigadeId,
        } = data
        await user.update({brigadeId})
        await user.reload()
        return user
    }

    async createMainImage(id, data, img) {
        const user = await UserMapping.findByPk(id)
        if (!user) {
            throw new Error('Кабинет не найден в БД')
        }
        const file = FileService.save(img)
        if (file && user.image) {
            FileService.delete(user.image)
        }
        const {
            image = file ? file : user.image
        } = data
        await user.update({image})
        await user.reload()
        return user
    }

    


    async update(id, data) {
        const user = await UserMapping.findByPk(id)
        if (!user) {
            throw new Error('Пользователь не найден в БД')
        }
        const {
            phone = user.phone,
            role = user.role,
            password = user.password
        } = data
        await user.update({phone, role, password})
        return user
    }

    async delete(userId) {
        const user = await UserMapping.findByPk(userId);
        if (!user) {
            throw new Error('Пользователь не найден в БД');
        }
    
        const userImage = await UserImageMapping.findOne({ where: { userId } });
        if (userImage) {
            const image = userImage.image;
            FileService.delete(image);
            await userImage.destroy();
        }

        const userFile = await UserFileMapping.findOne({ where: { userId } });
        if (userFile) {
            const file = userFile.file;
            FileService.delete(file);
            await userFile.destroy();
        }
    
        await user.destroy();
        return user;
    }

    
}


export default new User()