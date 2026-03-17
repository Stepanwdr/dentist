import express from 'express';
import TimeSlotController from '../controllers/TimeSlotController.js';
import permit from '../middlewares/permisssions.js';

const router = express.Router();

// List time slots (auth required by default authorization middleware)
router.get('/', TimeSlotController.list);

// Create single slot (restricted roles)
router.post('/', permit('admin', 'administrator', 'director', 'doctor'), TimeSlotController.create);

// Batch create (restricted roles)
router.post('/batch', permit('admin', 'administrator', 'director', 'doctor'), TimeSlotController.createBatch);

// Update slot (restricted roles)
router.patch('/:id', permit('admin', 'administrator', 'director', 'doctor'), TimeSlotController.update);

// Delete slot (restricted roles)
router.delete('/:id', permit('admin', 'administrator', 'director', 'doctor'), TimeSlotController.remove);

export default router;
