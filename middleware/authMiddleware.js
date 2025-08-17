import jwt from 'jsonwebtoken'
import AppError from '../errors/AppError.js'

const authMiddleware = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1] || 
                 req.query.token;
    
    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY, {
      algorithms: ['HS256'],
      ignoreExpiration: false
    });

    if (!decoded.userId) {
      throw new Error('Invalid token: missing userId');
    }

    req.auth = {
      userId: decoded.userId,
      chatId: decoded.chatId
    };

    next();
  } catch (err) {
    const errorMessage = err instanceof jwt.TokenExpiredError 
      ? 'Token expired' 
      : err instanceof jwt.JsonWebTokenError 
        ? 'Invalid token' 
        : err.message;
    
    next(AppError.unauthorized(errorMessage));
  }
};

export default authMiddleware;