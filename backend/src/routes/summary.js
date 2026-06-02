import { Router } from 'express'
import { getSummary } from '../controllers/summaryController.js'
import { protect }    from '../middleware/auth.js'

const router = Router()
router.get('/', protect, getSummary)
export default router
