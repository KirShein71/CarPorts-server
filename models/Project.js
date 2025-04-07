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
import sequelize from "../sequelize.js";
import {Op}  from 'sequelize'
import FileService from '../services/File.js'





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
                    attributes: ['date_id'], // Здесь можно оставить пустым, если не нужны другие поля
                    include: [
                        {
                            model: DateMapping,
                            attributes: ['date'], // Здесь указываем, что хотим получить поле date
                            required: true // Это гарантирует, что будут возвращены только те записи, у которых есть соответствующий DateMapping
                        }
                    ]
                }
            ],
        });
        return projects;
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
        const shipmentdetails = await ShipmentDetailsMapping.findAll({
            where: {
              project_id: id
            }
          });
          const shipmentDetails = shipmentdetails.map(detail => {
            return {
                quantity: detail.shipment_quantity,
                detailId: detail.detailId
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
            }
          });
          const userProject = user.map(user => {
            return {
                image: user.image,
                userId: user.id
            }
          }) 

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

        return {project, projectmaterials, extractedDetails, shipmentDetails, projectbrigades, userProject, brigadesdate: formattedBrigadesDate, complaints }
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


    async create(data) {
        const {name, number, agreement_date, design_period, expiration_date, installation_period, installation_billing, note, designer, design_start, project_delivery, date_inspection, inspection_designer, regionId} = data

        const installationBillingValue = installation_billing ? parseInt(installation_billing) : null;
        const regionIdValue = regionId ? parseInt(regionId) : null;

        const project = await ProjectMapping.create({name, number, agreement_date, design_period, expiration_date, installation_period, installation_billing: installationBillingValue, note, designer, design_start, project_delivery, date_inspection, inspection_designer, regionId: regionIdValue})
        
        const created = await ProjectMapping.findByPk(project.id) 
        return created
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