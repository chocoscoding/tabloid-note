const { Router } = require('express')
const router = Router();
const {login_signup, checkuser, logout} = require('../controllers/auth');
const {getallnote,changeinfo, createtemplate } = require('../controllers/notes');


router.post('/', login_signup);
router.route('/api/v1').get(checkuser).post(logout)
router.route('/api/v1/:_id').get(getallnote).post(createtemplate)
router.route('/api/v1/:_id/:noteid').get(getallnote).patch(changeinfo);
module.exports = router;