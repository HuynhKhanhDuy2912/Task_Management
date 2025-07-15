const router = require('express').Router();
const ctl    = require('../controllers/category.controller');
const auth   = require('../middleware/auth.middleware');

router.use(auth);

router.post('/', ctl.createCategory);
router.get('/', ctl.getCategories);
router.get('/:id/tasks', ctl.getTasksByCategory);
router.delete('/:id', ctl.deleteCategory); 
router.post('/:id/tasks', ctl.addTask);
router.delete('/:id/tasks/:tid', ctl.deleteTask);
router.patch('/:id/tasks/:tid', ctl.updateTask); 

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Quản lý danh mục công việc
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Tạo mới danh mục
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lấy danh sách danh mục của người dùng
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Xóa danh mục theo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Xóa thành công
 */

/**
 * @swagger
 * /categories/{id}/tasks:
 *   get:
 *     summary: Lấy các task thuộc danh mục
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách công việc
 */

/**
 * @swagger
 * /categories/{id}/tasks:
 *   post:
 *     summary: Thêm công việc vào danh mục
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, startTime, endTime, categoryId]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               done:
 *                 type: boolean
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo task thành công
 */

/**
 * @swagger
 * /categories/{id}/tasks/{tid}:
 *   delete:
 *     summary: Xóa task khỏi danh mục
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

/**
 * @swagger
 * /categories/{id}/tasks/{tid}:
 *   patch:
 *     summary: Cập nhật thông tin task
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               done:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

