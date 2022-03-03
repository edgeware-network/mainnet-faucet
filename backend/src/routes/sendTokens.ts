import { WsProvider, Keyring, ApiPromise } from '@polkadot/api';
import { cryptoWaitReady, checkAddress } from '@polkadot/util-crypto';
import express, { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import expressip from 'express-ip'
import Storage from '../storage'

const router = express.Router();
router.use(expressip().getIpInfoMiddleware);
config();
const storage = new Storage();
const keyring = new Keyring({ type: 'sr25519' });

function changeAddressEncoding(address, toNetworkPrefix=42){
    if(!address) {
        return null;
    }
    const pubKey = keyring.decodeAddress(address);
    const encodedAddress = keyring.encodeAddress(pubKey, toNetworkPrefix);

    if(encodedAddress == process.env.ADDRESS) {
        return null;
    }
    return encodedAddress;
}

function checkAmount(amount) {
    const MAX_EDG = (process.env.MAX_EDG || 10);
    amount = Number(amount);
    if(isNaN(amount)) {
        return {checkAmountMessage: "Amount should be a number!", checkAmountIsValid: false}
    } else if(amount <= 0 || amount > MAX_EDG) {
        return {checkAmountMessage: `Amount should be within 0 and ${MAX_EDG}`, checkAmountIsValid: false}
    } else {
        return {checkAmountMessage: "Valid", checkAmountIsValid: true, validAmount: amount}
    }
}

router.get('/', async (req: any, res: Response, next: NextFunction) => {
    const address = changeAddressEncoding(req.query.address.toString());
    let { chain, amount } = req.query;

    const sender = req.ipInfo.ip;
    const URL_TEST_NET = process.env.URL_TEST_NET || 'ws://beresheet1.edgewa.re:9944';
    const tokenDecimals = Number(process.env.TOKEN_DECIMALS) || 18;
    
    const limit = Number(process.env.REQUEST_LIMIT) || 3;
    const mnemonic = process.env.FAUCET_ACCOUNT_MNEMONIC?.toString();
    const wsProvider = new WsProvider(URL_TEST_NET);

    let networkPrefix;
    chain = chain?.toString().toLowerCase();
    switch (chain) { // Reference: https://github.com/paritytech/substrate/blob/master/primitives/core/src/crypto.rs#L432-L461
        case 'polkadot':
            networkPrefix = 0;
            break;
        case 'kusama':
            networkPrefix = 2;
            break;
        case 'edgeware':
            networkPrefix = 7;
            break;
        case 'edgeware-local':
        case 'beresheet':
            networkPrefix = 42;
            break
        default:
            networkPrefix = -1;
            break;
    }
    // put checks here according to IP address and address requesting
    const allowed = await storage.isValid(sender, address, chain, limit);

    async function run() {
        const api = await ApiPromise.create({ provider: wsProvider });

        await cryptoWaitReady();
        const transferValue = amount * 1e18 // EDG to weiEDG
        let account;
        if (mnemonic) account = keyring.addFromUri(mnemonic);

        try {
            if (address && account) {
                let bal: any = await api.query.system.account(account.address)
                console.log("bal: ", Number(bal.data.free), "amount: ", transferValue)
                if (Number(bal.data.free) > 0 && Number(bal.data.free) > transferValue) {
                    const txHash = await api.tx.balances
                        .transfer(address.toString(), transferValue.toString())
                        .signAndSend(account);
                    await storage.saveData(sender, address, chain);
                    let bal: any = await api.query.system.account(account.address)
                    console.log(`Remaining balance in Faucet ${account.address} ${bal.data.free.toHuman()}`);
                    return txHash
                }
                else {
                    console.log(`Remaining balance in Faucet ${bal.data.free}`);
                    return -1;
                }
            }
        } catch (error) {
            res.json({ trxHash: String(error), msg: `Something went wrong.\n Try again later` });
        }
    }
    if (!allowed) {
        res.json({ trxHash: -1, msg: 'You have reached your limit for now.\n Please try again later' });
    } else {
        const { checkAmountMessage, checkAmountIsValid, validAmount } = checkAmount(amount);
        if (checkAmountIsValid) {
            amount = validAmount;
            if (address && checkAddress(address.toString(), networkPrefix)[0]) {
                const hash = await run();
                if (hash === -1) {
                    res.json({ trxHash: hash, msg: `Sorry! Insufficient test EDG balance in the faucet` });    
                } else {
                    res.json({ trxHash: hash, msg: `${amount} tEDG transferred to ${address}` });
                }
            } else {
                res.json({ trxHash: -1, msg: 'Address not valid against the chain' })
            }
        } else {
            res.status(500).send({msg: checkAmountMessage})
        }
    }
});

export default router;

