import { Employee as EmployeeMapping} from './mapping.js'

class Employee {
    async getAll() {
        const employees = await EmployeeMapping.findAll()
        return employees
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
        const {phone, role, name, speciality} = data
        const check = await EmployeeMapping.findOne({where: {phone}})
        if (check) {
            throw new Error('Пользователь уже существует')
        }
        const employee = await EmployeeMapping.create({phone, role, name, speciality})
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