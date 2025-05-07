import { getUserByGoogleId, createUser } from '../repositories/userRepository.js';

const findOrCreateUser = async (googleId, email, name, picture) => {
    let user = await getUserByGoogleId(googleId);
    if (!user) {
        user = await createUser({ googleId, email, name, picture });
    };
    return user;
};

export { findOrCreateUser };