// Very simple admin check. Not bank-grade security, just enough to
// keep the admin routes from being open to everyone.
function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];

  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  next();
}

module.exports = adminAuth;
