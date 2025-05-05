import express from 'express';
import { verifyCreateOrFetchUser } from '../controllers/authController.js';

const router = express.Router();

router.get('/google/callback', verifyCreateOrFetchUser);

router.get('/google', (req, res) => {
    const scope = ['openid', 'email', 'profile'].join(' ');
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}` +
      `&response_type=code&scope=${encodeURIComponent(scope)}`;
    
    res.redirect(redirectUrl);
  });

export default router;