// src/utils/ApiResponse.js
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static success(res, data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  static paginated(res, data, pagination, message = "Success") {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message,
      data,
      pagination,
    });
  }
}

module.exports = ApiResponse;
