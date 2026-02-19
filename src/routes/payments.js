const express = require('express');
const ctrl = require('../controllers/paymentController');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.use(authRequired);
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
