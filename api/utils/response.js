/**
 * Standard API response format
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} status - Response status (success, error, fail)
 * @param {string} message - Response message
 * @param {Object} data - Response data
 * @returns {Object} Response object
 */
const sendResponse = (res, statusCode, status, message, data = null) => {
    const response = {
        status,
        message
    };

    if (data) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object} data - Response data
 * @returns {Object} Response object
 */
const sendSuccess = (res, statusCode, message, data) => {
    return sendResponse(res, statusCode, 'success', message, data);
};

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @returns {Object} Response object
 */
const sendError = (res, statusCode, message) => {
    return sendResponse(res, statusCode, 'error', message);
};


export default { sendSuccess, sendError };