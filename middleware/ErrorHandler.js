import AppError from "../errors/AppError.js"

// Функция(ошибка, запрос, ответ, передача следующему middleware)
const ErrorHandler = (err, req, res, next) => {
    // здесь мы проверяем была ли ошибка
    if (err instanceof AppError) {
        console.log(err)
        return res.status(err.status).json({message: err.message})
    }
    return res.status(500).json({message: err.message})
    return res.status(500).json({message: 'Непредвиденная ошибка'})
}

export default ErrorHandler