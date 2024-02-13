import express, {Request, Response, NextFunction} from 'express';
import { WsProvider, Keyring, ApiPromise } from '@polkadot/api';
import { config } from 'dotenv';
config();

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const URL_TEST_NET = process.env.URL_TEST_NET || 'wss://beresheet.jelliedowl.net';
    const wsProvider = new WsProvider(URL_TEST_NET);
    const api = await ApiPromise.create({ provider: wsProvider });
    let bal: any = await api.query.system.account(process.env.ADDRESS)

    res.send({
        balance: bal.data.free.toHuman(),
        address: process.env.ADDRESS,
        max: process.env.MAX_EDG
    })
});

export default router;
