// Error handler middleware (add this to your Express app)
module.exports= function errorHandler (err, req, res, next) {
  console.error('API Error:', {
    path: req.path,
    method: req.method,
    body: req.body,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.errors 
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
};