import sequelize from '../sequelize.js'
import database from 'sequelize'

const { DataTypes } = database


const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    phone: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    password: { type: DataTypes.STRING, allowNull: false },
    projectId: {type: DataTypes.INTEGER, allowNull: false},
    manager: {type: DataTypes.STRING, allowNull: true},
    manager_phone: { type: DataTypes.STRING, allowNull: true },
    image: {type: DataTypes.STRING, allowNull: true},
    telegram_chat_id: {type: DataTypes.INTEGER, allowNull: true},
    temporary_token: {type: DataTypes.INTEGER, allowNull: true},
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
    password: { type: DataTypes.STRING, allowNull: false },
})

const ManagerSale = sequelize.define('manager_sale', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    phone: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: "ManagerSale" },
    password: { type: DataTypes.STRING, allowNull: false },
})

const ManagerProject = sequelize.define('manager_project', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    phone: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: "ManagerProject" },
    password: { type: DataTypes.STRING, allowNull: false },
})

const ManagerProduction = sequelize.define('manager_production', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    phone: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: "ManagerProduction" },
    password: { type: DataTypes.STRING, allowNull: false },
})

const Constructor = sequelize.define('constructor', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    phone: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: " Constructor" },
    password: { type: DataTypes.STRING, allowNull: false },
})

const Employee = sequelize.define('employee', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    phone: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, unique: true },
    speciality: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: "EMPLOYEE" },
    password: { type: DataTypes.STRING, allowNull: false },
})


const Project = sequelize.define('project', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    agreement_date: {type: DataTypes.DATE, allowNull: false},
    design_period: {type: DataTypes.INTEGER, allowNull: false},
    expiration_date: {type: DataTypes.INTEGER, allowNull: false},
    installation_period: {type: DataTypes.INTEGER, allowNull: false},
    installation_billing: {type: DataTypes.INTEGER, allowNull: true},
    note: {type: DataTypes.STRING, allowNull: false},
    designer: {type: DataTypes.STRING, allowNull: true}, 
    design_start: {type: DataTypes.DATE, allowNull: true},
    project_delivery: {type: DataTypes.DATE, allowNull: true},
    date_inspection: {type: DataTypes.DATE, allowNull: true},
    inspection_designer: {type: DataTypes.STRING, allowNull: true},
    date_finish: {type: DataTypes.DATE, allowNull: true},
    finish: {type: DataTypes.STRING, allowNull: true},
    contact: {type: DataTypes.STRING, allowNull: true},
    address: {type: DataTypes.STRING, allowNull: true},
    navigator: {type: DataTypes.STRING, allowNull: true},
    coordinates: {type: DataTypes.STRING, allowNull: true},
    price: {type: DataTypes.INTEGER, allowNull: true},
    designerId: {type: DataTypes.INTEGER, allowNull: true}
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
    plan_date: { type: DataTypes.DATE, allowNull: true },
    check: { type: DataTypes.STRING, allowNull: true},
    materialName: {type: DataTypes.STRING, allowNull: false},
    color: { type: DataTypes.STRING, allowNull: true},
    weight: { type: DataTypes.INTEGER, allowNull: true},
    dimensions: { type: DataTypes.INTEGER, allowNull: true},
    notification_sent: {type: DataTypes.BOOLEAN, allowNull: true},
})

const Detail = sequelize.define('detail', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true },
    number: {type: DataTypes.STRING, allowNull: true},
    price: {type: DataTypes.INTEGER, allowNull: false},
    weight: {type: DataTypes.REAL, allowNull: true},
})

const ProjectDetails = sequelize.define('project_details', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: {type: DataTypes.INTEGER, allowNull: true},
    color: {type: DataTypes.STRING, allowNull: true },
})

const Antypical = sequelize.define('antypical', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    image: {type: DataTypes.STRING, allowNull: false },
    antypicals_quantity: {type: DataTypes.INTEGER, allowNull: true},
    color: {type: DataTypes.STRING, allowNull: true },
    name: {type: DataTypes.STRING, allowNull: true },
    antypicals_shipment_quantity: {type: DataTypes.INTEGER, allowNull: true},
    antypicals_delivery_quantity: {type: DataTypes.INTEGER, allowNull: true},
    antypicals_welders_quantity: {type: DataTypes.INTEGER, allowNull: true},
})

const StockAntypical = sequelize.define('stock_antypical', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    antypical_quantity: {type: DataTypes.INTEGER, allowNull: false},
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

const DeliverytDetails = sequelize.define('delivery_details', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    delivery_quantity: {type: DataTypes.INTEGER, allowNull: false},
   
})

const Brigade= sequelize.define('brigade', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true },
    phone: { type: DataTypes.STRING, unique: true },
    image: {type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "INSTALLER" },
    password: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.STRING, allowNull: false}
})

const BrigadeWork= sequelize.define('brigade_work', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type: DataTypes.INTEGER, allowNull: false}
})

const ProjectBrigades = sequelize.define('project_brigades', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    plan_start: { type: DataTypes.DATE, allowNull: true },
    plan_finish: { type: DataTypes.DATE, allowNull: true },

})

const BrigadesDate = sequelize.define('brigades_date', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    weekend: {type: DataTypes.STRING, allowNull: true},
    warranty: {type: DataTypes.STRING, allowNull: true},
    downtime: {type: DataTypes.STRING, allowNull: true}
})


const Date = sequelize.define('date', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    date: {type: DataTypes.DATE, allowNull: false},
})

const Region = sequelize.define('region', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    region: {type: DataTypes.STRING, allowNull: false},
})

const Service = sequelize.define('service', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    name: {type: DataTypes.STRING, allowNull: false},
    number: {type: DataTypes.REAL, allowNull: true},
    active: { type: DataTypes.STRING, allowNull: false}
})

const Estimate = sequelize.define('estimate', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    price: {type: DataTypes.INTEGER, allowNull: false},
    done: {type: DataTypes.STRING, allowNull: true},
})

const Payment = sequelize.define('payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    date: {type: DataTypes.DATE, allowNull: false},
    sum: {type: DataTypes.INTEGER, allowNull: true},
})


const Complaint = sequelize.define('complaint', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    date: {type: DataTypes.DATE, allowNull: false},
    note: {type: DataTypes.STRING, allowNull: true},
    date_finish: {type: DataTypes.DATE, allowNull: true}
    
})


const ComplaintImage = sequelize.define('complaint_image', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    image: {type: DataTypes.STRING, allowNull: false }
})

const ComplaintEstimate = sequelize.define('complaint_estimate', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    price: {type: DataTypes.INTEGER, allowNull: false},
    done: {type: DataTypes.STRING, allowNull: true},
    
})

const ComplaintPayment = sequelize.define('complaint_payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    date: {type: DataTypes.DATE, allowNull: false},
    sum: {type: DataTypes.INTEGER, allowNull: true},
})

const Supplier = sequelize.define('suppliers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    name: {type: DataTypes.STRING, allowNull: false},
    contact: {type: DataTypes.STRING, allowNull: true},
    address: {type: DataTypes.STRING, allowNull: true},
    shipment: {type: DataTypes.STRING, allowNull: true},
    navigator: {type: DataTypes.STRING, allowNull: true},
    note: {type: DataTypes.STRING, allowNull: true},
    coordinates: {type: DataTypes.STRING, allowNull: true},
})

const Examination = sequelize.define('examination', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
    name: {type: DataTypes.STRING, allowNull: false},
    number: {type: DataTypes.REAL, allowNull: true},
})

const ProjectExamination = sequelize.define('project_examination', {
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
     result: {type: DataTypes.INTEGER, allowNull: true},
})

const Designer = sequelize.define('designer', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true },
    active: { type: DataTypes.STRING, allowNull: false}
})

const Сoefficient = sequelize.define('coefficient', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true },
    number: {type: DataTypes.REAL, allowNull: true},
})

const NpsChapter = sequelize.define('nps_chapter', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true },
    number: {type: DataTypes.REAL, allowNull: true},
})

const NpsQuestion = sequelize.define('nps_question', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING },
    nps_chapter_id: {type: DataTypes.INTEGER, allowNull: true}
})

const NpsProject = sequelize.define('nps_project', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    score: {type: DataTypes.INTEGER},
    nps_chapter_id: {type: DataTypes.INTEGER, allowNull: true},
    nps_question_id: {type: DataTypes.INTEGER, allowNull: true}
})

const NpsNote = sequelize.define('nps_note', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    note: {type: DataTypes.STRING, allowNull: true},
})

const WarehouseAssortment = sequelize.define('warehouse_assortements', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: true},
    cost_price: {type: DataTypes.REAL, allowNull: true},
    shipment_price: {type: DataTypes.REAL, allowNull: true},
    weight: {type: DataTypes.REAL, allowNull: true},
    number: {type: DataTypes.REAL, allowNull: true},
    active: { type: DataTypes.STRING, allowNull: false}
})

const ProjectWarehouse = sequelize.define('project_warehouse', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: {type: DataTypes.INTEGER, allowNull: true},
    quantity_stat: {type: DataTypes.INTEGER, allowNull: true},
    warehouse_assortement_id: {type: DataTypes.INTEGER, allowNull: true},
    note: {type: DataTypes.STRING, allowNull: true}
})

const ShipmentWarehouse = sequelize.define('shipment_warehouse', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    done: { type: DataTypes.STRING, allowNull: false},
    warehouse_assortement_id: {type: DataTypes.INTEGER, allowNull: true},
    
})

const TemplatesTask = sequelize.define('templates_task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    number: {type: DataTypes.REAL, allowNull: true},
    name: {type: DataTypes.STRING, allowNull: true},
    note: {type: DataTypes.STRING, allowNull: true},
    term: {type: DataTypes.STRING, allowNull: true},
    active: { type: DataTypes.STRING, allowNull: false},
    executor: {type: DataTypes.INTEGER, allowNull: true},
    executor_name: { type: DataTypes.STRING, allowNull: true}
})

const ProjectTask = sequelize.define('project_task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    number: {type: DataTypes.REAL, allowNull: true},
    name: {type: DataTypes.STRING, allowNull: true},
    note: {type: DataTypes.STRING, allowNull: true},
    term: {type: DataTypes.STRING, allowNull: true},
    done: { type: DataTypes.STRING, allowNull: false},
    executor: {type: DataTypes.INTEGER, allowNull: true},
    executor_name: { type: DataTypes.STRING, allowNull: true}
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

Detail.hasMany(DeliverytDetails, { onDelete: 'CASCADE', hooks: true })
DeliverytDetails.belongsTo(Detail)

Project.hasMany(DeliverytDetails, {onDelete: 'CASCADE', hooks: true})
DeliverytDetails.belongsTo(Project)

Project.hasMany(Antypical)
Antypical.belongsTo(Project)

Antypical.hasMany(ProjectDetails, {foreignKey: 'projectId', targetKey: 'projectId'})
ProjectDetails.belongsTo(Antypical, {foreignKey: 'projectId', targetKey: 'projectId'})

StockAntypical.hasMany(StockDetails, {foreignKey: 'stock_date', targetKey: 'stock_date'})
StockDetails.belongsTo(StockAntypical, {foreignKey: 'stock_date', targetKey: 'stock_date'})

Brigade.hasMany(User);
User.belongsTo(Brigade)

Brigade.hasMany(ProjectBrigades)
ProjectBrigades.belongsTo(Brigade)

Project.hasMany(ProjectBrigades, { onDelete: 'CASCADE', hooks: true })
ProjectBrigades.belongsTo(Project)

Project.hasMany(BrigadesDate, {onDelete: 'CASCADE', hooks: true})
BrigadesDate.belongsTo(Project)

Complaint.hasMany(BrigadesDate, {onDelete: 'CASCADE', hooks: true})
BrigadesDate.belongsTo(Complaint)

Brigade.hasMany(BrigadesDate)
BrigadesDate.belongsTo(Brigade)

Date.hasMany(BrigadesDate)
BrigadesDate.belongsTo(Date)

Region.hasMany(Brigade)
Brigade.belongsTo(Region)

Region.hasMany(Project)
Project.belongsTo(Region)

Region.hasMany(BrigadesDate)
BrigadesDate.belongsTo(Region)

Region.hasMany(BrigadeWork)
BrigadeWork.belongsTo(Region)

Project.hasMany(User, {onDelete: 'CASCADE', hooks: true})
User.belongsTo(Project)

User.hasMany(UserImage, { onDelete: 'CASCADE', hooks: true })
UserImage.belongsTo(User)

User.hasMany(UserFile, { onDelete: 'CASCADE', hooks: true })
UserFile.belongsTo(User)

ManagerProject.hasMany(User)
User.belongsTo(ManagerProject)

Employee.hasMany(User)
User.belongsTo(Employee)

Project.hasMany(Estimate, { onDelete: 'CASCADE', hooks: true })
Estimate.belongsTo(Project)

Service.hasMany(Estimate, { onDelete: 'CASCADE', hooks: true })
Estimate.belongsTo(Service)

Brigade.hasHooks(Estimate, { onDelete: 'CASCADE', hooks: true })
Estimate.belongsTo(Brigade)

Brigade.hasHooks(Payment, { onDelete: 'CASCADE', hooks: true })
Payment.belongsTo(Brigade)

Project.hasMany(Payment, { onDelete: 'CASCADE', hooks: true })
Payment.belongsTo(Project)

Project.hasMany(Complaint, {onDelete: 'CASCADE', hooks: true})
Complaint.belongsTo(Project)

Complaint.hasMany(ComplaintImage, { onDelete: 'CASCADE', hooks: true })
ComplaintImage.belongsTo(Complaint)

Complaint.hasMany(ComplaintEstimate, { onDelete: 'CASCADE', hooks: true })
ComplaintEstimate.belongsTo(Complaint)

Service.hasMany(ComplaintEstimate, { onDelete: 'CASCADE', hooks: true })
ComplaintEstimate.belongsTo(Service)

Brigade.hasHooks(ComplaintEstimate, { onDelete: 'CASCADE', hooks: true })
ComplaintEstimate.belongsTo(Brigade)

Brigade.hasHooks(ComplaintPayment, { onDelete: 'CASCADE', hooks: true })
ComplaintPayment.belongsTo(Brigade)

Complaint.hasMany(ComplaintPayment, { onDelete: 'CASCADE', hooks: true })
ComplaintPayment.belongsTo(Complaint)

Region.hasMany(Supplier)
Supplier.belongsTo(Region)

Supplier.hasMany(Material)
Material.belongsTo(Supplier)

Supplier.hasMany(ProjectMaterials)
ProjectMaterials.belongsTo(Supplier)

Examination.hasMany(ProjectExamination, {onDelete: 'CASCADE', hooks: true})
ProjectExamination.belongsTo(Examination)

Project.hasMany(ProjectExamination, {onDelete: 'CASCADE', hooks: true})
ProjectExamination.belongsTo(Project)

Brigade.hasMany(ProjectExamination, {onDelete: 'CASCADE', hooks: true})
ProjectExamination.belongsTo(Brigade)

NpsChapter.hasMany(NpsQuestion, {onDelete: 'CASCADE', hooks: true})
NpsQuestion.belongsTo(NpsChapter)


NpsChapter.hasMany(NpsProject, {onDelete: 'CASCADE', hooks: true})
NpsProject.belongsTo(NpsChapter)

NpsQuestion.hasMany(NpsProject, {onDelete: 'CASCADE', hooks: true})
NpsProject.belongsTo(NpsQuestion)

Project.hasMany(NpsProject, {onDelete: 'CASCADE', hooks: true})
NpsProject.belongsTo(Project)

Project.hasMany(NpsNote, {onDelete: 'CASCADE', hooks: true})
NpsNote.belongsTo(Project)

Project.hasMany(ProjectWarehouse, {onDelete: 'CASCADE', hooks: true})
ProjectWarehouse.belongsTo(Project)

WarehouseAssortment.hasMany(ProjectWarehouse, { onDelete: 'CASCADE', hooks: true })
ProjectWarehouse.belongsTo(WarehouseAssortment)

Project.hasMany(ShipmentWarehouse, {onDelete: 'CASCADE', hooks: true})
ShipmentWarehouse.belongsTo(Project)

WarehouseAssortment.hasMany(ShipmentWarehouse, { onDelete: 'CASCADE', hooks: true })
ShipmentWarehouse.belongsTo(WarehouseAssortment)

Project.hasMany(ProjectTask, {onDelete: 'CASCADE', hooks: true})
ProjectTask.belongsTo(Project)


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
    StockAntypical,
    BrigadesDate,
    Date,
    Region, 
    Service,
    Estimate,
    ManagerSale,
    ManagerProject,
    Constructor, 
    ManagerProduction,
    BrigadeWork,
    Payment, 
    Complaint,
    ComplaintImage,
    ComplaintEstimate,
    ComplaintPayment,
    DeliverytDetails,
    Supplier,
    Examination,
    ProjectExamination,
    Designer,
    Сoefficient,
    NpsChapter,
    NpsQuestion,
    NpsProject,
    NpsNote,
    WarehouseAssortment,
    ProjectWarehouse,
    ShipmentWarehouse,
    TemplatesTask,
    ProjectTask
}