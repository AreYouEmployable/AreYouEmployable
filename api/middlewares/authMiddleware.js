const verifyGoogleIdToken = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('Auth Middleware: Authorization header missing or not Bearer.');
        return res.status(401).json({ 
          error: 'unauthorized', 
          message: 'Authorization header is missing or not in Bearer format.' 
        });
      }
  
      const id_token = authHeader.split(' ')[1];
      if (!id_token) {
        console.warn('Auth Middleware: ID token missing after Bearer.');
        return res.status(401).json({ 
          error: 'unauthorized', 
          message: 'ID token is missing.' 
        });
      }
  
      const decodedTokenUnverified = jwt.decode(id_token, { complete: true });
      if (!decodedTokenUnverified || !decodedTokenUnverified.header || !decodedTokenUnverified.header.kid) {
        return res.status(401).json({ 
          error: 'invalid_token', 
          message: 'Invalid ID token structure.' 
        });
      }
      const kid = decodedTokenUnverified.header.kid;
  
      const pemPublicKey = await getGooglePublicKey(kid);
  
      const payload = jwt.verify(id_token, pemPublicKey, {
        algorithms: ['RS256'], 
        issuer: ['accounts.google.com', 'https://accounts.google.com'],
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      req.user = payload;
      next();
  
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token_expired', message: 'Token has expired.' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(403).json({ error: 'invalid_token', message: 'Token is invalid or malformed.' });
      }
      return res.status(500).json({ error: 'authentication_error', message: 'Could not process authentication.' });
    }
  };
  
  export { verifyGoogleIdToken };