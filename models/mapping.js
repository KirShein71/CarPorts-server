import sequelize from '../sequelize.js'
import database from 'sequelize'

const { DataTypes } = database


const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" }
})


const Project = sequelize.define('project', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.INTEGER, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    agreement_date: {type: DataTypes.DATE, allowNull: false},
    design_period: {type: DataTypes.INTEGER, allowNull: false},
    expiration_date: {type: DataTypes.INTEGER, allowNull: false},
    installation_period: {type: DataTypes.INTEGER, allowNull: false},
    note: {type: DataTypes.STRING, allowNull: false},
    designer: {type: DataTypes.STRING, allowNull: true}, 
    design_start: {type: DataTypes.DATE, allowNull: true},
    project_delivery: {type: DataTypes.DATE, allowNull: true},
    status: {type: DataTypes.STRING, allowNull: true}
})

const Material = sequelize.define('material', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true }
})

const ProjectMaterials = sequelize.define('project_materials', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date_payment: { type: DataTypes.DATE, allowNull: false },
    expiration_date: { type: DataTypes.INTEGER, allowNull: false },
    ready_date: { type: DataTypes.DATE, allowNull: false },
    shipping_date: { type: DataTypes.DATE, allowNull: false },
    check: { type: DataTypes.STRING, allowNull: true},
    materialName: {type: DataTypes.STRING, allowNull: false}
})

const Detail = sequelize.define('detail', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true }
})

const ProjectDetails = sequelize.define('project_details', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: {type: DataTypes.INTEGER, allowNull: false},
   
})


const Installer = sequelize.define('installer', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true }
})

const ProjectInstallers = sequelize.define('project_installers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    plan_start: { type: DataTypes.DATE, allowNull: true },
    plan_finish: { type: DataTypes.DATE, allowNull: true },

})


Project.hasMany(ProjectMaterials)
ProjectMaterials.belongsTo(Project)

Material.hasMany(ProjectMaterials)
ProjectMaterials.belongsTo(Material)

Project.hasMany(ProjectDetails)
ProjectDetails.belongsTo(Project)

Detail.hasMany(ProjectDetails)
ProjectDetails.belongsTo(Detail)

Installer.hasMany(ProjectInstallers)
ProjectInstallers.belongsTo(Installer)

Project.hasMany(ProjectInstallers)
ProjectInstallers.belongsTo(Project)



export {
    User,
    Project,
    Material,
    ProjectMaterials,
    Detail,
    ProjectDetails,
    Installer,
    ProjectInstallers
}