import sequelize from '../sequelize.js'
import database from 'sequelize'

const { DataTypes } = database


const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    phone: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    projectId: {type: DataTypes.INTEGER, allowNull: false},
    manager: {type: DataTypes.STRING, allowNull: true},
    manager_phone: { type: DataTypes.STRING, allowNull: true },
})

const UserImage = sequelize.define('userimage', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date: {type: DataTypes.STRING, allowNull: false },
    image: {type: DataTypes.STRING, allowNull: false }
})

const UserFile = sequelize.define('userfile', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: { type: DataTypes.STRING, unique: true },
    file: {type: DataTypes.BLOB, allowNull: true }
})

const Admin = sequelize.define('admin', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    phone: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: "ADMIN" },
})

const Employee = sequelize.define('employee', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    phone: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, unique: true },
    speciality: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: "EMPLOYEE" },
})


const Project = sequelize.define('project', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    agreement_date: {type: DataTypes.DATE, allowNull: false},
    design_period: {type: DataTypes.INTEGER, allowNull: false},
    expiration_date: {type: DataTypes.INTEGER, allowNull: false},
    installation_period: {type: DataTypes.INTEGER, allowNull: false},
    note: {type: DataTypes.STRING, allowNull: false},
    designer: {type: DataTypes.STRING, allowNull: true}, 
    design_start: {type: DataTypes.DATE, allowNull: true},
    project_delivery: {type: DataTypes.DATE, allowNull: true},
    date_inspection: {type: DataTypes.DATE, allowNull: true},
    inspection_designer: {type: DataTypes.STRING, allowNull: true},
})

const Material = sequelize.define('material', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true }
})

const ProjectMaterials = sequelize.define('project_materials', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date_payment: { type: DataTypes.DATE, allowNull: true },
    expirationMaterial_date: { type: DataTypes.INTEGER, allowNull: true },
    ready_date: { type: DataTypes.DATE, allowNull: true },
    shipping_date: { type: DataTypes.DATE, allowNull: true },
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

const Antypical = sequelize.define('antypical', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    image: {type: DataTypes.STRING, allowNull: false }
})

const StockAntypical = sequelize.define('stock_antypical', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    stock_quantity: {type: DataTypes.INTEGER, allowNull: false},
    stock_date: {type: DataTypes.DATE, allowNull: false} 
})

const StockDetails = sequelize.define('stock_details', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    stock_quantity: {type: DataTypes.INTEGER, allowNull: false},
    stock_date: {type: DataTypes.DATE, allowNull: false} 
})

const ShipmentDetails = sequelize.define('shipment_details', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shipment_quantity: {type: DataTypes.INTEGER, allowNull: false},
    shipment_date: {type: DataTypes.DATE, allowNull: false}
})


const Brigade= sequelize.define('brigade', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true },
    phone: { type: DataTypes.STRING, unique: true },
    image: {type: DataTypes.STRING, allowNull: false }
})


const ProjectBrigades = sequelize.define('project_brigades', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    plan_start: { type: DataTypes.DATE, allowNull: true },
    plan_finish: { type: DataTypes.DATE, allowNull: true },

})


Project.hasMany(ProjectMaterials, {onDelete: 'CASCADE', hooks: true})
ProjectMaterials.belongsTo(Project)

Material.hasMany(ProjectMaterials, {onDelete: 'CASCADE', hooks: true})
ProjectMaterials.belongsTo(Material)

Project.hasMany(ProjectDetails, {onDelete: 'CASCADE', hooks: true})
ProjectDetails.belongsTo(Project)

Detail.hasMany(ProjectDetails, { onDelete: 'CASCADE', hooks: true })
ProjectDetails.belongsTo(Detail)

Detail.hasMany(StockDetails, { onDelete: 'CASCADE', hooks: true })
StockDetails.belongsTo(Detail)

Detail.hasMany(ShipmentDetails, { onDelete: 'CASCADE', hooks: true })
ShipmentDetails.belongsTo(Detail)

Project.hasMany(ShipmentDetails, {onDelete: 'CASCADE', hooks: true})
ShipmentDetails.belongsTo(Project)

Project.hasMany(Antypical)
Antypical.belongsTo(Project)

Antypical.hasMany(ProjectDetails, {foreignKey: 'projectId', targetKey: 'projectId'})
ProjectDetails.belongsTo(Antypical, {foreignKey: 'projectId', targetKey: 'projectId'})

Brigade.hasMany(User);
User.belongsTo(Brigade)

Brigade.hasMany(ProjectBrigades)
ProjectBrigades.belongsTo(Brigade)

Project.hasMany(ProjectBrigades, { onDelete: 'CASCADE', hooks: true })
ProjectBrigades.belongsTo(Project)

Project.hasMany(User, {onDelete: 'CASCADE', hooks: true})
User.belongsTo(Project)

User.hasMany(UserImage, { onDelete: 'CASCADE', hooks: true })
UserImage.belongsTo(User)

User.hasMany(UserFile, { onDelete: 'CASCADE', hooks: true })
UserFile.belongsTo(User)







export {
    User,
    UserImage,
    UserFile,
    Project,
    Material,
    ProjectMaterials,
    Detail,
    ProjectDetails,
    StockDetails,
    ShipmentDetails,
    Admin,
    Employee,
    Brigade,
    ProjectBrigades,
    Antypical,
    StockAntypical
}