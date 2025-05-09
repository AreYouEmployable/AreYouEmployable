import jwt from 'jsonwebtoken';
import { getGooglePublicKey } from '../utils/functions/googlePublicKey.js';
import { findOrCreateUser } from '../services/userService.js';


const verifyCreateOrFetchUser = async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;
    
    if (!code) {
      return res.status(400).json({ 
        error: 'missing_authorization_code',
        message: 'The authorization code from Google is missing. Please try signing in again.' 
      });
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      throw new Error('token_exchange_failed'); 
    }

    const tokenData = await tokenResponse.json();
    const id_token = tokenData.id_token;

    if (!id_token) {
        console.error('ID token not found in Google response.');
        throw new Error('id_token_missing');
    }
    
    let payload;
    try {
      const decodedTokenUnverified = jwt.decode(id_token, { complete: true });
      if (!decodedTokenUnverified || !decodedTokenUnverified.header || !decodedTokenUnverified.header.kid) {
        throw new Error('Invalid ID token structure or missing kid in header.');
      }
      const kid = decodedTokenUnverified.header.kid;

      const pemPublicKey = await getGooglePublicKey(kid);

      payload = jwt.verify(id_token, pemPublicKey, {
        algorithms: ['RS256'], 
        issuer: ['accounts.google.com', 'https://accounts.google.com'], 
        audience: process.env.GOOGLE_CLIENT_ID,
      });

    } catch (validationError) {
        console.error('Google ID Token validation failed:', validationError.message);
        if (validationError.name === 'TokenExpiredError') {
            throw new Error('id_token_expired');
        } else if (validationError.name === 'JsonWebTokenError') {
            throw new Error('id_token_invalid_signature_or_claims');
        }
        throw new Error('id_token_validation_failed');
    }

    const googleUserId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    const user = await findOrCreateUser(googleUserId, email, name, picture);


    const clientUrl =  process.env.CLIENT_URI;
    let redirectUrl = `${clientUrl}?google_id_token=${encodeURIComponent(id_token)}`;
    if (state) {
      redirectUrl += `&state=${encodeURIComponent(state)}`;
    }
    
    console.log('Redirecting to client with Google ID token.');
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Auth error details:', error.message, error.stack);
    const clientUrl = process.env.CLIENT_URI;
    const receivedState = req.query.state;

    let clientErrorType = 'authentication_failed';
    if (error.message === 'token_exchange_failed') clientErrorType = 'token_exchange_error';
    else if (error.message === 'id_token_missing') clientErrorType = 'id_token_missing_error';
    else if (error.message === 'id_token_expired') clientErrorType = 'id_token_expired_error';
    else if (error.message === 'id_token_invalid_signature_or_claims') clientErrorType = 'id_token_invalid_error';
    else if (error.message === 'id_token_validation_failed') clientErrorType = 'id_token_processing_error';
    else if (error.message === 'forbidden') clientErrorType = 'forbidden_error';
    
    let errorUrl = `${clientUrl}?error=${encodeURIComponent(clientErrorType)}`;
    if (receivedState) {
        errorUrl += `&state=${encodeURIComponent(receivedState)}`;
    }
    
    res.redirect(errorUrl);
  }
};

export { verifyCreateOrFetchUser };