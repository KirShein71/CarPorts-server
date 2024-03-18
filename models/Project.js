import { Project as ProjectMapping } from "./mapping.js";
import { Antypical as AntypicalMapping } from "./mapping.js";
import sequelize from "../sequelize.js";
import FileService from '../services/File.js'





class Project {
    async getAll() {
        const projects = await ProjectMapping.findAll({
            // order: [
            //     ['agreement_date', 'DESC'],
            // ],
        })
        return projects
    }

    async getAllWithNoInstallers() {
        try {
            const projectsWithoutInstallers = await sequelize.query(
              `SELECT *
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
                `SELECT name, number, id 
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

    async create(data) {
        const {name, number, agreement_date, design_period, expiration_date, installation_period, note, designer, design_start, project_delivery, date_inspection, inspection_designer} = data
        const project = await ProjectMapping.create({name, number, agreement_date, design_period, expiration_date, installation_period, note, designer, design_start, project_delivery, date_inspection, inspection_designer})
        
        const created = await ProjectMapping.findByPk(project.id) 
        return created
    }

    

    async update(id, data) {
        const project = await ProjectMapping.findByPk(id)
        if (!project) {
            throw new Error('Товар не найден в БД')
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
            date_inspection = project.date_inspection
            
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