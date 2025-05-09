import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { findOrCreateUser } from '../services/userService.js';

let googlePublicKeys = null;
let keysFetchTime = 0;
const KEYS_CACHE_DURATION = 60 * 60 * 1000;
let isFetchingKeys = false;
let keyFetchPromise = null;

async function getGooglePublicKey(kid) {
  const now = Date.now();
  
  if (isFetchingKeys) {
    await keyFetchPromise;
  }
  
  if (!googlePublicKeys || (now - keysFetchTime > KEYS_CACHE_DURATION)) {
    try {
      isFetchingKeys = true;
      keyFetchPromise = (async () => {
        try {
          const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
          if (!response.ok) {
            throw new Error(`Failed to fetch Google JWKS: ${response.statusText}`);
          }
          googlePublicKeys = await response.json();
          keysFetchTime = now;
        } catch (error) {
          googlePublicKeys = null;
          throw error;
        } finally {
          isFetchingKeys = false;
          keyFetchPromise = null;
        }
      })();
      
      await keyFetchPromise;
    } catch (error) {
      throw error;
    }
  }

  if (!googlePublicKeys || !googlePublicKeys.keys) {
    throw new Error('Google public keys are not available.');
  }

  const key = googlePublicKeys.keys.find(k => k.kid === kid);
  if (!key) {
    throw new Error(`Matching Google public key not found for kid: ${kid}`);
  }

  try {
    const publicKeyObject = crypto.createPublicKey({
      key: key,
      format: 'jwk'
    });
    const pemPublicKey = publicKeyObject.export({
      type: 'spki', 
      format: 'pem'
    });
    return pemPublicKey;
  } catch (conversionError) {
    console.error('Error converting JWK to PEM using crypto module:', conversionError);
    throw new Error('Failed to convert Google public key to PEM format.');
  }
}

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

    console.log('Google ID token validated successfully. Payload:', payload);

    const googleUserId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    // const user = await findOrCreateUser(googleUserId, email, name, picture);


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