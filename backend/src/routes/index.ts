import { Router } from 'express';
import testAPI from './testAPI';
import sendTokens from './sendTokens'

// Init router and path
const router = Router();


// Add sub-routes
router.use('/testAPI', testAPI)
router.use('/sendTokens', sendTokens)

// Export the base-router
export default router;
