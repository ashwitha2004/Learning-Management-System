/**
 * @errorMiddleware - Global error handling middleware.
 * Catches any errors thrown in the application and formats the response with appropriate status and message.
 * It also returns the stack trace for development purposes (can be removed in production).
 */
const errorMiddlware=(err, req, res, next)=>{
    err.statusCode= err.statusCode||500;
    err.message= err.message||"Something went wrong";

    const response = {
        success:false,
        message:err.message,
    };

    if(process.env.NODE_ENV !== 'production'){
        response.stack = err.stack;
    }

    res.status(err.statusCode).json(response)
}
export default errorMiddlware;