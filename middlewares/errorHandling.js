app.get("/error", (req, res, next) => {
    const error = new Error("Custom problem happened!");
    error.statusCode = 400; 
    next(error);
  });