import { sendSuccess } from '../utils/response.js';

const getUsers = (req, res) => {
    console.log(req)
    return sendSuccess(res, 200, 'Users fetched successfully', users);
};

export default getUsers;