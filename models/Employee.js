import { Employee as EmployeeMapping} from './mapping.js'

class Employee {
    async getAll() {
        const employees = await EmployeeMapping.findAll()
        return employees
    }

    async getManager() {
        const employee = await EmployeeMapping.findAll({
            where: {
                id: 4
            }, 
            
        })
        return employee.map(employee => ({
            id: employee.id,
            name: employee.name
        }));
    }

    async getOne(id) {
            const employee = await EmployeeMapping.findByPk(id);
            if (!employee) {
              throw new Error('Пользователь не найден в БД');
            }
            return employee;
          }

    async getByPhone(phone) {
        const employee = await EmployeeMapping.findOne({where: {phone}})
        if (!employee) {
            throw new Error('Пользователь не найден в БД')
        }
        return employee
    }


    async create(data) {
        const {phone, password, role, name, speciality} = data
        const check = await EmployeeMapping.findOne({where: {phone}})
        if (check) {
            throw new Error('Пользователь уже существует')
        }
        const employee = await EmployeeMapping.create({phone, password, role, name, speciality})
        return employee
    }


    async delete(id) {
        const employee = await EmployeeMapping.findByPk(id)
        if (!employee) {
            throw new Error('Пользователь не найден в БД')
        }
        await employee.destroy()
        return employee
    }
}


export default new Employee()