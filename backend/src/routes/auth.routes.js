const router = require('express').Router();
  const ctl    = require('../controllers/auth.controller');

  router.post('/register', ctl.register);
  router.post('/login',    ctl.login);

  module.exports = router;