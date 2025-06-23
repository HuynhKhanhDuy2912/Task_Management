const router = require('express').Router();
const ctl    = require('../controllers/category.controller');
const auth   = require('../middleware/auth.middleware');

router.use(auth);

router.post('/',                 ctl.createCategory);         // POST    /api/categories
router.get('/',                  ctl.getCategories);          // GET     /api/categories
router.get('/:id/tasks', ctl.getTasksByCategory); // Thêm dòng này
router.delete('/:id',            ctl.deleteCategory);         // DELETE  /api/categories/:id
router.post('/:id/tasks',        ctl.addTask);                // POST    /api/categories/:id/tasks
router.delete('/:id/tasks/:tid', ctl.deleteTask);             // DELETE  /api/categories/:id/tasks/:tid
router.patch('/:id/tasks/:tid',  ctl.updateTask);             // PATCH   /api/categories/:id/tasks/:tid

module.exports = router;
