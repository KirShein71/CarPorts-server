import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError.js';

const authVerifyTokenMiddleware = async (req, res, next) => {
  // Пропускаем preflight-запросы OPTIONS
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    // Получаем токен из разных источников
    const token = req.headers.authorization?.split(' ')[1] || 
                 req.query.token || 
                 req.body.token;
    
    if (!token) {
      throw new Error('Требуется авторизация: токен не предоставлен');
    }

    // Верификация токена
    const decoded = jwt.verify(token, process.env.SECRET_KEY || process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      ignoreExpiration: false
    });

    // Проверка необходимых полей в токене
    if (!decoded.userId) {
      throw new Error('Невалидный токен: отсутствует userId');
    }

    // Добавляем декодированные данные в запрос
    req.auth = {
      userId: decoded.userId,
      ...(decoded.chatId && { chatId: decoded.chatId })
    };

    // Передаем управление следующему middleware
    next();
  } catch (err) {
    // Обработка разных типов ошибок
    let errorMessage = 'Ошибка аутентификации';
    
    if (err instanceof jwt.TokenExpiredError) {
      errorMessage = 'Срок действия токена истек';
    } else if (err instanceof jwt.JsonWebTokenError) {
      errorMessage = 'Неверная подпись токена';
    } else if (err.message.includes('authorization') || err.message.includes('токен')) {
      errorMessage = err.message;
    }

    // Передаем ошибку в обработчик ошибок
    next(AppError.unauthorized(errorMessage));
  }
};

export default authVerifyTokenMiddleware;