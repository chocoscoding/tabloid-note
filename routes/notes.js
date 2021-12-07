const { Router } = require('express')
const router = Router();
const {checkuser} = require('../controllers/auth');
router.get('/api/v1', checkuser)
module.exports = router;