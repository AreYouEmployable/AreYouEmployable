import crypto from 'crypto';

let googlePublicKeys = null;
let keysFetchTime = 0;
const KEYS_CACHE_DURATION = 60 * 60 * 1000;
let isFetchingKeys = false;
let keyFetchPromise = null;

export async function getGooglePublicKey(kid) {
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
