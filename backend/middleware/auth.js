import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function authMiddleware(req, res, next) {
  // 1. Extract Authorization Header
  const authHeader = req.headers.authorization;
  console.log("Line 7 ...",authHeader);
  if (!authHeader) {
    console.warn('Authorization header missing');
    return res.status(401).json({ 
      message: "Authentication required",
      code: "MISSING_AUTH_HEADER"
    });
  }

  // 2. Verify Bearer Token Format
  if (!authHeader.startsWith('Bearer ')) {
    console.warn('Malformed authorization header');
    return res.status(401).json({ 
      message: "Invalid authorization format",
      code: "INVALID_AUTH_FORMAT"
    });
  }

  // 3. Extract and Verify Token
  const token = authHeader.split(' ')[1];
  
  try {
    // 4. Verify JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // Specify allowed algorithms
      ignoreExpiration: false // Explicitly check expiration
    });

    // console.log(`Authenticating user ID: ${payload.id}`);

    // 5. Fetch User from Database
    const user = await User.findById(payload.id)
      .select('_id accessToken login')
      .lean();

    if (!user) {
      console.warn(`User not found for ID: ${payload.id}`);
      return res.status(401).json({ 
        message: "User account not found",
        code: "USER_NOT_FOUND"
      });
    }

    // 6. Attach User to Request
    req.user = {
      id: user._id,
      accessToken: user.accessToken,
      login: user.login,
      tokenPayload: payload // Optional: attach the full payload
    };

    console.log(`User authenticated: ${user.login}`);
    next();

  } catch (err) {
    console.error('JWT verification failed:', err.message);

    // Specific error handling
    const response = {
      message: "Authentication failed",
      code: "AUTH_FAILED"
    };

    if (err.name === 'TokenExpiredError') {
      response.message = "Token expired";
      response.code = "TOKEN_EXPIRED";
    } else if (err.name === 'JsonWebTokenError') {
      response.message = "Invalid token";
      response.code = "INVALID_TOKEN";
    }

    return res.status(401).json(response);
  }
}