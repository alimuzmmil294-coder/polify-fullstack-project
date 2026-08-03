import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization || "";

  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, token missing.",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    // Make sure your JWT payload actually uses 'id' (e.g. jwt.sign({ id: user._id }))
    // If you signed it with { userId: user._id }, change this to decoded.userId
    req.userId = decoded.id || decoded.userId || decoded._id;
    console.log(req.userId);
    
    if (!req.userId) {
      return res.status(401).json({
        message: "Invalid token payload.",
        success: false,
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: error.message || "Not authorized, token failed.",
      success: false,
    });
  }
};
