import jwt from 'jsonwebtoken'
import AppError from '../errors/AppError.js'

const authMiddleware = async (req, res, next) => {
  // Пропускаем preflight-запросы OPTIONS
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    // 1. Проверка наличия заголовка Authorization
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new Error('Требуется авторизация: заголовок Authorization отсутствует')
    }

    // 2. Извлечение токена из заголовка
    const token = authHeader.split(' ')[1] // Bearer <token>
    if (!token) {
      throw new Error('Требуется авторизация: токен не предоставлен')
    }

    // 3. Верификация токена
    const decoded = jwt.verify(token, process.env.SECRET_KEY, {
      algorithms: ['HS256'], // Явно указываем алгоритм
      ignoreExpiration: false, // Проверяем срок действия
    })

    // 4. Проверка необходимых полей в токене
    if (!decoded.userId || !decoded.chatId) {
      throw new Error('Невалидный токен: отсутствуют обязательные поля')
    }

    // 5. Добавляем декодированные данные в запрос
    req.auth = {
      userId: decoded.userId,
      chatId: decoded.chatId,
      // Другие данные из токена при необходимости
    }

    // 6. Передаем управление следующему middleware
    next()
  } catch (err) {
    // Обработка разных типов ошибок
    let errorMessage = 'Ошибка аутентификации'
    
    if (err instanceof jwt.TokenExpiredError) {
      errorMessage = 'Срок действия токена истек'
    } else if (err instanceof jwt.JsonWebTokenError) {
      errorMessage = 'Неверная подпись токена'
    } else if (err.message.includes('authorization')) {
      errorMessage = err.message
    }

    // Передаем ошибку в обработчик ошибок
    next(AppError.forbidden(errorMessage))
  }
}

export default authMiddleware