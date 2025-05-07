import db from '../database.js';

const getUserByGoogleId = async (googleId) => {
    const result = await db.query(
        'SELECT * FROM users WHERE google_id = $1',
        [googleId]
    );
    return result.rows[0] || null;
};

const createUser = async ({ googleId, email, name, picture }) => {
    const result = await db.query(
        `
        INSERT INTO users (google_id, email, username, picture)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [googleId, email, name, picture]
    );
    return result.rows[0];
};

export { getUserByGoogleId, createUser };