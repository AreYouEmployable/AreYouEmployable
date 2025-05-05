import jwt from 'jsonwebtoken';
import { findOrCreateUser } from '../services/userService.js';

const verifyCreateOrFetchUser = async (req, res) => {
    try {

        const code = req.query.code;
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code'
        })
      });
  
      if (!tokenResponse.ok) {
        throw new Error(`Token exchange failed: ${await tokenResponse.text()}`);
      }
  
      const { access_token } = await tokenResponse.json();
        // const { access_token } = req.body;
        
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${ access_token }`
            }
        });

        if (!response.ok) {
            throw new Error('Invalid Google token');
        }

        const {id, email, name, picture} = await response.json();

        const user = await findOrCreateUser(id, email, name, picture);

        const token = jwt.sign(
            {
                user_id: user.user_id,
                google_id: user.google_id,
                email: user.email,
                username: user.username,
                picture: user.picture
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

export { verifyCreateOrFetchUser };