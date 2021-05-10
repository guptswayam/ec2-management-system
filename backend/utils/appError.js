class AppError extends Error{
    constructor(message="Invalid Body!", code=400){
        super(message);
        this.statusCode = code;
        this.custom = true
    }
}

module.exports = AppError;