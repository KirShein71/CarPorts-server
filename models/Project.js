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
import sequelize from "../sequelize.js";
import {Op}  from 'sequelize'
import FileService from '../services/File.js'





class Project {
    async getAll() {
        const projects = await ProjectMapping.findAll({
            include: [
                {model: RegionMapping, attributes: ['region']}
            ],
            where: {
                date_finish: null
            }
        })
        return projects
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
              `SELECT name, id, date_finish, region_id
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
             )`,
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
             )`,
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
               )`,
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
                `SELECT name, number, id, date_finish 
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
                detailId: detail.detailId
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

        return {project, projectmaterials, extractedDetails, shipmentDetails, projectbrigades, userProject, brigadesdate: formattedBrigadesDate }
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
        const {name, number, agreement_date, design_period, expiration_date, installation_period, note, designer, design_start, project_delivery, date_inspection, inspection_designer, regionId} = data
        const project = await ProjectMapping.create({name, number, agreement_date, design_period, expiration_date, installation_period, note, designer, design_start, project_delivery, date_inspection, inspection_designer, regionId})
        
        const created = await ProjectMapping.findByPk(project.id) 
        return created
    }

    async createDateFinish(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        const {
            date_finish = project.date_finish,
        } = data
        await project.update({date_finish})
        await project.reload()
        return project
    }

    async deleteDateFinish(id) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Проект не найден в БД')
        }
        await project.update({date_finish: null})
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
            note = project.note,
            designer = project.designer,
            inspection_designer = project.inspection_designer,
            date_inspection = project.date_inspection,
            
            
        } = data
        await project.update({name, number, agreement_date, design_period, project_delivery, expiration_date, installation_period, note, designer, design_start, project_delivery, inspection_designer, date_inspection})
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