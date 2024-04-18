import { User as UserMapping } from "./mapping.js";
import { Project as ProjectMapping } from "./mapping.js";
import { Employee as EmployeeMapping } from "./mapping.js";
import { Admin as AdminMapping } from "./mapping.js";
import { UserFile as UserFileMapping } from "./mapping.js";
import { UserImage as UserImageMapping } from "./mapping.js";
import { Brigade as BrigadeMapping } from "./mapping.js";
import FileService from '../services/File.js'

class User {
    async getAll() {
        const users = await UserMapping.findAll({
            include: [
                {model: ProjectMapping,
                attributes: ['number', 'name']}
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
                throw new Error('Личный кабинет еще не создан');
        }
            return user;
    }

    async getOneAccount(id) {
        const user = await UserMapping.findByPk(id, {
          include: [
            {
              model: ProjectMapping,
              attributes: ['number', 'name', 'agreement_date', 'design_period', 'expiration_date', 'installation_period']
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
          ],
        });
        if (!user) {
          throw new Error('Пользователь не найден в БД');
        }
        return user;
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
            employeeId = user.employeeId,
        } = data
        await user.update({employeeId})
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