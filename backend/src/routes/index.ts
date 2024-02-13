import { Router } from 'express';
import testAPI from './testAPI';
import sendTokens from './sendTokens'
import faucetInfo from './faucetInfo';

// Init router and path
const router = Router();


// Add sub-routes
router.use('/testAPI', testAPI)
router.use('/sendTokens', sendTokens)
router.use('/faucetInfo', faucetInfo)

// Export the base-router
export default router;
