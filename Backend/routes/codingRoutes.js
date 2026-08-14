const router = require('express').Router();
const {
  createCodingResource,
  getAllCodingResources,
  getCodingResourceById,
  updateCodingResource,
  deleteCodingResource
} = require('../controllers/codingController');

const authMiddleware = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');


router.post('/', authMiddleware, restrictTo('senior', 'admin'), createCodingResource);

router.get('/', getAllCodingResources);
router.get('/:id', getCodingResourceById);

router.put('/:id', authMiddleware, updateCodingResource);
router.delete('/:id', authMiddleware, deleteCodingResource);


module.exports = router;