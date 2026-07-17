const express = require('express');
const orgController = require('../controllers/organization.controller');
const { validate } = require('../middlewares/validate.middleware');
const { requireAuth } = require('../middlewares/auth.middleware');
const orgValidation = require('../validations/organization.validation');

const router = express.Router();

router.use(requireAuth); // Protect all organization routes

router.post('/', validate(orgValidation.createOrgSchema), orgController.create);
router.get('/', orgController.getMine);

module.exports = router;
