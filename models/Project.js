import { Project as ProjectMapping } from "./mapping.js";
import { Antypical as AntypicalMapping } from "./mapping.js";
import { ProjectMaterials as ProjectMaterialsMapping } from "./mapping.js";
import { ProjectDetails as ProjectDetailsMapping } from "./mapping.js";
import { ShipmentDetails as ShipmentDetailsMapping } from "./mapping.js";
import { ProjectBrigades as ProjectBrigadesMapping } from "./mapping.js";
import { Brigade as BrigadeMapping } from "./mapping.js";
import { User as UserMapping} from './mapping.js'
import { Region as RegionMapping} from './mapping.js'
import {BrigadesDate as BrigadesDateMapping} from './mapping.js'
import { Date as DateMapping} from './mapping.js'
import { Complaint as ComplaintMapping } from "./mapping.js";
import { DeliverytDetails as DeliveryDetailsMapping } from "./mapping.js";
import { ProjectExamination as ProjectExaminationMapping } from "./mapping.js";
import { UserFile as UserFileMapping } from "./mapping.js";
import { NpsProject as NpsProjectMapping } from "./mapping.js";
import { NpsChapter as NpsChapterMapping } from "./mapping.js";
import {Estimate as EstimateMapping} from './mapping.js'
import { TemplatesTask as TemplatesTaskMapping } from "./mapping.js";
import { ProjectTask as ProjectTaskMapping } from "./mapping.js";
import sequelize from "../sequelize.js";
import {Op}  from 'sequelize'
import FileService from '../services/File.js'
import bcrypt from 'bcrypt'
import bot from '../TelegramBot.js'




const saltRounds = 10;

class Project {
    async getAll() {
        const projects = await ProjectMapping.findAll({
            include: [
                {
                    model: RegionMapping,
                    attributes: ['region']
                },
                {
                    model: BrigadesDateMapping,
                    attributes: ['date_id'],
                    include: [
                        {
                            model: DateMapping,
                            attributes: ['date'],
                            required: true
                        }
                    ]
                },
                {
                    model: ProjectExaminationMapping,
                    attributes: ['id', 'result']
                }
            ]
        });

        // Получаем все главы
        const chapters = await NpsChapterMapping.findAll({
            attributes: ['id', 'number'],
            raw: true
        });

        // Создаем карту chapter_id -> number
        const chapterMap = {};
        chapters.forEach(chapter => {
            chapterMap[chapter.id] = chapter.number;
        });

        // Получаем NPS оценки сгруппированные по проекту и главе
        const projectIds = projects.map(p => p.id);
        
        // Получаем все project_id, которые есть в таблице Estimate
        const estimates = await EstimateMapping.findAll({
            where: {
                project_id: projectIds
            },
            attributes: ['project_id'],
            raw: true
        });

        // Создаем Set для быстрой проверки наличия project_id в таблице Estimate
        const estimateProjectIds = new Set(estimates.map(est => est.project_id));

        const npsScores = await NpsProjectMapping.findAll({
            where: {
                project_id: projectIds
            },
            attributes: [
                'project_id',
                'nps_chapter_id',
                [sequelize.fn('AVG', sequelize.col('score')), 'averageScore']
            ],
            group: ['project_id', 'nps_chapter_id'],
            raw: true
        });

        // Группируем результаты по проекту
        const npsByProject = {};
        npsScores.forEach(item => {
            if (!npsByProject[item.project_id]) {
                npsByProject[item.project_id] = {};
            }
            
            const chapterNumber = chapterMap[item.nps_chapter_id];
            if (chapterNumber) {
                const average = parseFloat(item.averageScore) || 0;
                npsByProject[item.project_id][`npsChapter${chapterNumber}`] = 
                    Math.round((average / 5) * 100 * 100) / 100;
            }
        });

        // Добавляем NPS к проектам как отдельные поля и поле estimate
        return projects.map(project => {
            const projectData = project.toJSON();
            const projectNps = npsByProject[project.id] || {};
            
            // Добавляем каждую главу как отдельное поле
            Object.keys(projectNps).forEach(key => {
                projectData[key] = projectNps[key];
            });
            
            // Добавляем поле estimate
            projectData.estimate = estimateProjectIds.has(project.id);
            
            return projectData;
        });
    }

    async getAllActiveProject() {
        const projects = await ProjectMapping.findAll({
            where: {
                date_finish: null,
                finish: null
            },
            attributes: ['id', 'name', 'number', 'regionId','designer', 'designerId', 'agreement_date', 'design_period', 'design_start', 'project_delivery', 'expiration_date', 'installation_period', 'price'],
            include: [
                {
                    model: RegionMapping,
                    attributes: ['region']
                },
                {
                    model: BrigadesDateMapping,
                    attributes: ['date_id'], // Здесь можно оставить пустым, если не нужны другие поля
                    include: [
                        {
                            model: DateMapping,
                            attributes: ['date', 'id'], // Здесь указываем, что хотим получить поле date
                            required: true // Это гарантирует, что будут возвращены только те записи, у которых есть соответствующий DateMapping
                        },
                        {
                            model: BrigadeMapping,
                            attributes: ['name']
                        },
                    ]
                }
            ],
        });
        return projects;
    }

    async getAllActiveWithDateFinishProject() {
        const projects = await ProjectMapping.findAll({
            where: {
                finish: null
            },
            attributes: ['id', 'name', 'number', 'regionId','designer', 'designerId', 'agreement_date', 'design_period', 'design_start', 'project_delivery', 'expiration_date', 'installation_period', 'price'],
            include: [
                {
                    model: RegionMapping,
                    attributes: ['region']
                },
                {
                    model: BrigadesDateMapping,
                    attributes: ['date_id'], // Здесь можно оставить пустым, если не нужны другие поля
                    include: [
                        {
                            model: DateMapping,
                            attributes: ['date', 'id'], // Здесь указываем, что хотим получить поле date
                            required: true // Это гарантирует, что будут возвращены только те записи, у которых есть соответствующий DateMapping
                        },
                        {
                            model: BrigadeMapping,
                            attributes: ['name']
                        },
                    ]
                }
            ],
        });
        return projects;
    }

    async getAllStatProject() {
        const projects = await ProjectMapping.findAll({
            attributes: ['id', 'name', 'number', 'agreement_date', 'date_finish']
        });
        
        // Получаем текущую дату
        const currentDate = new Date();
        
        // Вычисляем дату 3 месяца назад
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(currentDate.getMonth() - 4);
        
        // Фильтруем проекты
        const filteredProjects = projects.filter(project => {
            const agreementDate = new Date(project.agreement_date);
            const finishDate = project.date_finish ? new Date(project.date_finish) : null;
            
            // Проверяем agreement_date в пределах последних 3 месяцев
            const isAgreementInRange = agreementDate >= threeMonthsAgo && agreementDate <= currentDate;
            
            // Проверяем date_finish в пределах последних 3 месяцев (если есть)
            const isFinishInRange = finishDate && finishDate >= threeMonthsAgo && finishDate <= currentDate;
            
            // Возвращаем проекты, которые подходят под любое из условий
            return isAgreementInRange || isFinishInRange;
        });
  
        return filteredProjects;
    }

    async getAllYearStatProject() {
    const projects = await ProjectMapping.findAll({
        attributes: ['id', 'name', 'number', 'agreement_date', 'date_finish']
    });
    
    // Группируем проекты по годам
    const projectsByYear = projects.reduce((acc, project) => {
        const agreementYear = project.agreement_date ? new Date(project.agreement_date).getFullYear() : null;
        const finishYear = project.date_finish ? new Date(project.date_finish).getFullYear() : null;
        
        // Добавляем в статистику по году подписания
        if (agreementYear) {
            if (!acc[agreementYear]) {
                acc[agreementYear] = {
                    year: agreementYear,
                    signed: 0,
                    finished: 0
                };
            }
            acc[agreementYear].signed += 1;
        }
        
        // Добавляем в статистику по году сдачи
        if (finishYear) {
            if (!acc[finishYear]) {
                acc[finishYear] = {
                    year: finishYear,
                    signed: 0,
                    finished: 0
                };
            }
            acc[finishYear].finished += 1;
        }
        
        return acc;
    }, {});
    
    // Преобразуем объект в массив и сортируем по годам
    const result = Object.values(projectsByYear).sort((a, b) => a.year - b.year);
    
    return result;
}

    async getAllStatSignedProject() {
        const projects = await ProjectMapping.findAll({});
        
        // Создаем объект для хранения статистики по месяцам
        const monthlyStats = {};
        
        // Обрабатываем каждый проект
        projects.forEach(project => {
            // Обрабатываем дату подписания (agreement_date)
            if (project.agreement_date) {
            const agreementDate = new Date(project.agreement_date);
            const agreementMonthKey = `${agreementDate.getFullYear()}-${(agreementDate.getMonth() + 1).toString().padStart(2, '0')}`;
            const agreementMonthFormatted = `${(agreementDate.getMonth() + 1).toString().padStart(2, '0')}.${agreementDate.getFullYear()}`;
            
            if (!monthlyStats[agreementMonthKey]) {
                monthlyStats[agreementMonthKey] = {
                month: agreementMonthFormatted,
                signed: 0,
                finished: 0
                };
            }
            monthlyStats[agreementMonthKey].signed++;
            }
            
            // Обрабатываем дату сдачи (date_finish)
            if (project.date_finish) {
            const finishDate = new Date(project.date_finish);
            const finishMonthKey = `${finishDate.getFullYear()}-${(finishDate.getMonth() + 1).toString().padStart(2, '0')}`;
            const finishMonthFormatted = `${(finishDate.getMonth() + 1).toString().padStart(2, '0')}.${finishDate.getFullYear()}`;
            
            if (!monthlyStats[finishMonthKey]) {
                monthlyStats[finishMonthKey] = {
                month: finishMonthFormatted,
                signed: 0,
                finished: 0
                };
            }
            monthlyStats[finishMonthKey].finished++;
            }
        });
        
        // Преобразуем объект в массив и сортируем по дате
        const result = Object.values(monthlyStats).sort((a, b) => {
            const [aMonth, aYear] = a.month.split('.').map(Number);
            const [bMonth, bYear] = b.month.split('.').map(Number);
            
            if (aYear !== bYear) return aYear - bYear;
            return aMonth - bMonth;
        });
        
        return result;
    }

    async getFinishProject() {
        const projects = await ProjectMapping.findAll({
            where: {
                date_finish: {
                    [Op.not]: null
                }
            }
        })
        return projects
    }

    async getAllWithNoInstallers() {
        try {
            const projectsWithoutInstallers = await sequelize.query(
              `SELECT name, id, finish, region_id
               FROM projects
               WHERE id NOT IN (
                 SELECT project_id
                 FROM project_brigades
               )`,
              { model: ProjectMapping }
            );
        
            return projectsWithoutInstallers;
          } catch (error) {
            console.error('Error executing query:', error);
            throw error;
          } 
    }

    async getAllWithNoDetails() {
        try {
          const projectsWithoutDetails = await sequelize.query(
            `SELECT *
             FROM projects
             WHERE id NOT IN (
               SELECT project_id
               FROM project_details
             ) AND finish IS NULL`,
            { model: ProjectMapping }
          );
      
          return projectsWithoutDetails;
        } catch (error) {
          console.error('Error executing query:', error);
          throw error;
        }
    }

      async getAllWithNoMaterials() {
        try {
            const projectsWithoutMaterials = await sequelize.query(
                `SELECT *
                 FROM projects
                 WHERE id NOT IN (
                   SELECT project_id
                   FROM project_materials
                 )
                 AND finish IS NULL`, 
                { model: ProjectMapping }
            );
    
            return projectsWithoutMaterials;
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }


      async getAllWithNoDesing() {
        try {
          const projectsWithoutDesing = await sequelize.query(
            `SELECT name, number, id, agreement_date, design_period
             FROM projects
             WHERE designer IS NULL OR designer = ''`,
            { model: ProjectMapping }
          );
      
          return projectsWithoutDesing;
        } catch (error) {
          console.error('Error executing query:', error);
          throw error;
        }
      }

      async getAllWithNoShipment() {
        try {
            const projectsWithoutShipment = await sequelize.query(
              `SELECT *
               FROM projects
               WHERE id NOT IN (
                 SELECT project_id
                 FROM shipment_details
               ) AND finish IS NULL`,
              { model: ProjectMapping }
            );
        
            return projectsWithoutShipment;
          } catch (error) {
            console.error('Error executing query:', error);
            throw error;
          } 
    }

    async getAllWithNoAccount() {
        try {
            const projectWithNoAccount = await sequelize.query(
                `SELECT name, number, id, finish 
                FROM projects
                WHERE id NOT IN (
                    SELECT project_id
                    FROM users
                 )`,
                 { model: ProjectMapping  }
            );
            return projectWithNoAccount
        
            } catch (error) {
                console.error('Error executing query:', error);
                throw error;
        } 
    }

    async getAllProjectsWithNoInBrigadesDate() {
        try {
          const projectsWithNoInBrigadesDate = await sequelize.query(
            `SELECT *
             FROM projects
             WHERE id NOT IN (
               SELECT project_id
               FROM brigades_dates
             ) AND finish IS NULL`,
            { model: ProjectMapping }
          );
      
          return projectsWithNoInBrigadesDate;
        } catch (error) {
          console.error('Error executing query:', error);
          throw error;
        }
    }

    async getAllProjectsWithNoInControlTour() {
        try {
          const getAllProjectsWithNoInControlTour = await sequelize.query(
            `SELECT *
             FROM projects
             WHERE id NOT IN (
               SELECT project_id
               FROM control_tours
             ) AND finish IS NULL`,
            { model: ProjectMapping }
          );
      
          return getAllProjectsWithNoInControlTour;
        } catch (error) {
          console.error('Error executing query:', error);
          throw error;
        }
    }

    async getAllWithNoWarehouseOrder() {
        try {
          const projectsWithoutDetails = await sequelize.query(
            `SELECT *
             FROM projects
             WHERE id NOT IN (
               SELECT project_id
               FROM project_warehouses
             ) AND finish IS NULL`,
            { model: ProjectMapping }
          );
      
          return projectsWithoutDetails;
        } catch (error) {
          console.error('Error executing query:', error);
          throw error;
        }
    }
    


    async getOne(id) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) { 
            throw new Error('Товар не найден в БД')
        }
        return project
    }

    async getProjectInfo(id) {
        const project = await ProjectMapping.findByPk(id)
        const projectmaterials = await ProjectMaterialsMapping.findAll({
            where: {
              project_id: id
            }
          });
        const projectdetails = await ProjectDetailsMapping.findAll({
            where: {
              project_id: id
            }
          });
        const extractedDetails = projectdetails.map(detail => {
            return {
                quantity: detail.quantity,
                detailId: detail.detailId,
                id: detail.id
            };
        });

        const projectantypical = await AntypicalMapping.findAll({
            where: {
              project_id: id
            }
          });
        const antypicalDetails = projectantypical.map(antypical => {
            return {
                image: antypical.image,
                id: antypical.id,
                name: antypical.name,
                antypicals_quantity: antypical.antypicals_quantity,
                antypicals_shipment_quantity: antypical.antypicals_shipment_quantity,
                antypicals_delivery_quantity: antypical.antypicals_delivery_quantity
            };
        });

        const shipmentdetails = await ShipmentDetailsMapping.findAll({
            where: {
              project_id: id
            }
          });
          const shipmentDetails = shipmentdetails.map(detail => {
            return {
                quantity: detail.shipment_quantity,
                detailId: detail.detailId,
                id: detail.id,
                date: detail.shipment_date
            };
        });

        const deliverydetails = await DeliveryDetailsMapping.findAll({
            where: {
              project_id: id
            }
          });
          const deliveryDetails = deliverydetails.map(detail => {
            return {
                quantity: detail.delivery_quantity,
                detailId: detail.detailId,
                id: detail.id,
            };
        });

        const projectbrigades = await ProjectBrigadesMapping.findAll({
            where: {
              project_id: id
            }, 
            include: [
              {
                  model: BrigadeMapping,
                  attributes: ['name']
              }
            ]
        });

        const user = await UserMapping.findAll({
            where: {
                project_id: id
            },
        });

        const userProject = user.map(user => {
            return {
                image: user.image,
                userId: user.id
            }
        }) 

        const userFile = await UserFileMapping.findAll({
        include: [{
            model: UserMapping,
            where: { project_id: id },
            attributes: []
        }],
        attributes: ['id', 'name', 'file', 'userId']
        });

        const brigadesdate = await BrigadesDateMapping.findAll({
            where: {
                project_id: id
            },
            include: [
                {
                    model: BrigadeMapping,
                    attributes: ['name']
                },
                {
                    model: DateMapping,
                    attributes: ['date']
                }
            ]
        });
    
        // Преобразование массива brigadesdate
        const formattedBrigadesDate = brigadesdate.map(item => ({
            name: item.brigade.name, // Доступ к атрибуту name модели BrigadeMapping
            date: item.date.date // Доступ к атрибуту date модели DateMapping
        }));
 

          if (!project && !projectmaterials) { 
            throw new Error('Товар не найден в БД')
        }

        const complaints = await ComplaintMapping.findAll({
            where: {
                project_id: id,
                date_finish: null
            },
            attributes: ['id', 'note', 'date']
        })

        return {project, projectmaterials, extractedDetails, antypicalDetails, shipmentDetails, deliveryDetails, projectbrigades, userProject, userFile, brigadesdate: formattedBrigadesDate, complaints }
    }

    async getProjectInfoInstallation(id) {
        const project = await ProjectMapping.findByPk(id);
        const brigadesdate = await BrigadesDateMapping.findAll({
            where: {
                project_id: id
            },
            include: [
                {
                    model: BrigadeMapping,
                    attributes: ['name']
                },
                {
                    model: DateMapping,
                    attributes: ['date']
                }
            ]
        });
    
        // Преобразование массива brigadesdate
        const formattedBrigadesDate = brigadesdate.map(item => ({
            name: item.brigade.name, // Доступ к атрибуту name модели BrigadeMapping
            date: item.date.date // Доступ к атрибуту date модели DateMapping
        }));
    
        if (!project) { 
            throw new Error('Проект не найден в БД');
        }
    
      
        return [{project, brigadesdate: formattedBrigadesDate} ];

    }


    async create(data, img) {
        const image = FileService.save(img) || '';
        const { 
            // Данные проекта
            name, number, agreement_date, design_period, expiration_date, 
            installation_period, installation_billing, note, designer, 
            design_start, project_delivery, date_inspection, inspection_designer, regionId, contact, address, navigator, coordinates, price,
            // Данные аккаунта
            phone, password,
        } = data;

        const transaction = await sequelize.transaction();

        try {
            // Создаем проект
            const installationBillingValue = installation_billing ? parseInt(installation_billing) : null;
            const regionIdValue = regionId ? parseInt(regionId) : null;

            const project = await ProjectMapping.create({
                name, number, agreement_date, design_period, expiration_date, 
                installation_period, installation_billing: installationBillingValue, 
                note, designer, design_start, project_delivery, 
                date_inspection, inspection_designer, regionId: regionIdValue, contact, address, navigator, coordinates, price
            }, { transaction });

            // Хешируем пароль перед сохранением
            const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);

            // Создаем аккаунт с хешированным паролем
            const account = await UserMapping.create({
                phone: phone.trim(),
                password: hashedPassword, // Используем хешированный пароль
                projectId: project.id,
                image: image
            }, { transaction });

            // Получаем все шаблоны задач
            const taskTemplates = await TemplatesTaskMapping.findAll({
                attributes: ['number', 'name', 'note', 'term', 'executor', 'executor_name', 'previous_task', 'term_integer'],
                raw: true
            }, { transaction });

            // Создаем задачи для проекта на основе шаблонов
            if (taskTemplates && taskTemplates.length > 0) {
                const projectTasks = taskTemplates.map(template => ({
                    projectId: project.id,
                    number: template.number,
                    name: template.name,
                    note: template.note || '',
                    term: template.term || '',
                    executor: template.executor,
                    executor_name: template.executor_name,
                    done: 'false',
                    previous_task: template.previous_task,
                    term_integer: template.term_integer,
                    date_done: null
            
                }));

                await ProjectTaskMapping.bulkCreate(projectTasks, { transaction });
            }

            await transaction.commit();

            return {
                project,
                account: {
                    ...account.get({ plain: true }),
                    password: undefined // Не возвращаем пароль в ответе
                }
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async createDateFinish(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            date_finish = project.date_finish, finish = project.finish
        } = data
        await project.update({date_finish, finish})
        await project.reload()
        return project
    }

    async updateDateFinish(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            date_finish = project.date_finish
        } = data
        await project.update({date_finish})
        await project.reload()
        return project
    }

    async restoreProject(id) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        await project.update({finish: null})
        await project.reload()
        return project
    }

    async closedProject(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
             finish = project.finish
        } = data
        await project.update({finish})
        await project.reload()
        return project
    }

    async createRegion(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            regionId = project.regionId,
        } = data
        await project.update({regionId})
        await project.reload()
        return project
    }

    async createInstallationBilling(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            installation_billing = project.installation_billing,
        } = data
        await project.update({installation_billing})
        await project.reload()
        return project
    }

    async createPriceProject(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            price = project.price,
        } = data
        await project.update({price})
        await project.reload()
        return project
    }

    

    async updateNote(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            note = project.note,
        } = data
        await project.update({note})
        await project.reload()
        return project
    }

    async updateDesignPeriod(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            design_period = project.design_period,
        } = data
        await project.update({design_period})
        await project.reload()
        return project
    }

    async updateExpirationDate(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            expiration_date = project.expiration_date,
        } = data
        await project.update({expiration_date})
        await project.reload()
        return project
    }

    async updateInstallationPeriod(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            installation_period = project.installation_period,
        } = data
        await project.update({installation_period})
        await project.reload()
        return project
    }

    async update(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            name = project.name,
            number = project.number,
            agreement_date = project.agreement_date,
            design_period = project.design_period,
            design_start = project.design_start,
            project_delivery = project.project_delivery,
            expiration_date = project.expiration_date,
            installation_period = project.installation_period,
            installation_billing = project.installation_billing,
            note = project.note,
            designer = project.designer,
            inspection_designer = project.inspection_designer,
            date_inspection = project.date_inspection,
            
            
        } = data
        await project.update({name, number, agreement_date, design_period, project_delivery, expiration_date, installation_period, installation_billing , note, designer, design_start, project_delivery, inspection_designer, date_inspection})
        await project.reload()
        return project
    }

    async updateDesigner(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            designerId = project.designerId,
            designer = project.designer,
        } = data
        await project.update({ designer, designerId})
        await project.reload()
        return project
    }

    async updateDesignStart(id, data) {
        try {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const oldDesignStart = project.design_start;
        const { design_start = project.design_start } = data;
        await project.update({design_start})
        await project.reload()
        if (oldDesignStart !== design_start) {
            await this.notifyDesignStartChange(project.id, design_start);
            
        }
        return project;
        } catch (error) {
            console.error('Ошибка при обновлении даты начала:', error);
            throw error;
        }
    }

    async notifyDesignStartChange(id) {
        
        try {
            // Находим всех пользователей, связанных с этим проектом
            const users = await sequelize.query(`
                SELECT u.telegram_chat_id 
                FROM users u
                WHERE u.project_id = :id
                AND u.telegram_chat_id IS NOT NULL
            `, {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT
            });
    
            if (users.length > 0) {
            
                const message = `📅 Проект взяли в работу`;
    
                // Отправляем сообщение каждому пользователю
                for (const user of users) {
                    try {
                        await bot.telegram.sendMessage(user.telegram_chat_id, message);
                        console.log(`Уведомление отправлено пользователю ${user.telegram_chat_id}`);
                    } catch (error) {
                        console.error(`Ошибка при отправке уведомления пользователю ${user.telegram_chat_id}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error('Ошибка при отправке уведомлений:', error);
        }
    }

    async updateProjectDelivery(id, data) {
        try {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const oldProjectDelivery = project.project_delivery;
        const { project_delivery = project.project_delivery } = data;
        await project.update({project_delivery})
        await project.reload()
        if (oldProjectDelivery !== project_delivery) {
            await this.notifyProjectDeliveryChange(project.id, project_delivery);
            
        }
        return project;
        } catch (error) {
            console.error('Ошибка при обновлении даты начала:', error);
            throw error;
        }
    }

    async notifyProjectDeliveryChange(id) {
        
        try {
            // Находим всех пользователей, связанных с этим проектом
            const users = await sequelize.query(`
                SELECT u.telegram_chat_id 
                FROM users u
                WHERE u.project_id = :id
                AND u.telegram_chat_id IS NOT NULL
            `, {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT
            });
    
            if (users.length > 0) {
            
                const message = `📅 Проект готов`;
    
                // Отправляем сообщение каждому пользователю
                for (const user of users) {
                    try {
                        await bot.telegram.sendMessage(user.telegram_chat_id, message);
                        console.log(`Уведомление отправлено пользователю ${user.telegram_chat_id}`);
                    } catch (error) {
                        console.error(`Ошибка при отправке уведомления пользователю ${user.telegram_chat_id}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error('Ошибка при отправке уведомлений:', error);
        }
    }

    async updateDateInspection(id, data) {
        try {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const oldDateInspection = project.date_inspection;
        const { date_inspection = project.date_inspection } = data;
        await project.update({date_inspection})
        await project.reload()
        if (oldDateInspection !== date_inspection) {
            await this.notifyDateInspectionChange(project.id, date_inspection);
            
        }
        return project;
        } catch (error) {
            console.error('Ошибка при обновлении даты начала:', error);
            throw error;
        }
    }

    async notifyDateInspectionChange(id) {
        
        try {
            // Находим всех пользователей, связанных с этим проектом
            const users = await sequelize.query(`
                SELECT u.telegram_chat_id 
                FROM users u
                WHERE u.project_id = :id
                AND u.telegram_chat_id IS NOT NULL
            `, {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT
            });
    
            if (users.length > 0) {
            
                const message = `📅 Проект проверен`;
    
                // Отправляем сообщение каждому пользователю
                for (const user of users) {
                    try {
                        await bot.telegram.sendMessage(user.telegram_chat_id, message);
                        console.log(`Уведомление отправлено пользователю ${user.telegram_chat_id}`);
                    } catch (error) {
                        console.error(`Ошибка при отправке уведомления пользователю ${user.telegram_chat_id}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error('Ошибка при отправке уведомлений:', error);
        }
    }

    async createLogisticProject(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            contact = project.contact,
            address = project.address,
            navigator = project.navigator,
            coordinates = project.coordinates,
        } = data
        await project.update({contact, address, navigator, coordinates})
        await project.reload()
        return project
    }

    async reviseProjectNameAndNumberAndInstallationBilling(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            name = project.name,
            number = project.number,
            installation_billing = project.installation_billing,  
        } = data
        await project.update({name, number, installation_billing})
        await project.reload()
        return project
    }

    async delete(projectId) {
        const project = await ProjectMapping.findByPk(projectId)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }

        const antypical = await AntypicalMapping.findOne({ where: { projectId } });
        if (antypical) {
            const image = antypical.image;
            FileService.delete(image);
            await antypical.destroy();
        }

        await project.destroy()
        return project
    }

}

export default new Project()