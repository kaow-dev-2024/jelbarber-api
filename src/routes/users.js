const express = require('express');
const ctrl = require('../controllers/userController');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authRequired);
router.get('/', requireRole('admin'), ctrl.list);
router.get('/:id', requireRole('admin'), ctrl.get);
router.post('/', requireRole('admin'), ctrl.create);
router.put('/:id', requireRole('admin'), ctrl.update);
router.delete('/:id', requireRole('admin'), ctrl.remove);

module.exports = router;
