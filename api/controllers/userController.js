import { sendSuccess } from '../utils/response.js';

const users = [
    { id: '1', name: 'Alfred Malope', email: '' },
    { id: '2', name: 'Manqoba Makhoba', email: '' }
];

const getUsers = (req, res) => {
    return sendSuccess(res, 200, 'Users fetched successfully', users);
};

export default getUsers;