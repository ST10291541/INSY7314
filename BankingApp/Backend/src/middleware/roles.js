// Simple role middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        console.log('requireRole called with roles:', roles);
        console.log('User role:', req.user?.role);
        
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const userRole = req.user.role;
        const requiredRoles = Array.isArray(roles) ? roles : [roles];
        
        if (!requiredRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: `Access denied. Required role: ${requiredRoles.join(' or ')}` 
            });
        }
        
        next();
    };
};

module.exports = { requireRole };