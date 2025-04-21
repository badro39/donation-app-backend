const errorHandler = (err, res) =>{
    console.error(err.stack);
    return res.status(err.status || 500).json({ message: err.message || "Server Error" });
}

export default errorHandler;