import React, { useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useState, useCallback } from 'react';
import './Body.css';
import logo from '../assets/logo.png';
import infoIcon from '../assets/Info.png';
import copyIcon from '../assets/copy.png';
import logEvent from '../utils/logEvent';
import constant from '../constants';

export default function Body(props) {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [faucetBalance, setFaucetBalance] = useState(0);
  const [limit, setLimit] = useState(10);
  const [faucetAddress, setFaucetAddress] = useState('nJvnbNuabPyqFVqUwgDbD5nxBT9mBKMv1qhCA25esiRJ1Wn');
  const [loadingBalance, setLoadingBalance] = useState(false);

  function callAPI() {
    if (loading) return;
    if (amount === '' || address === '') {
      alert('Please properly set amount and address');
      return;
    }
    if (Number(amount) > limit || Number(amount) < 0) {
      alert('Amount can be between 0 - ' + limit);
      return;
    }
    setLoading(true);
    const chain = 'edgeware';
    logEvent(constant.log.REQUEST_EDG_CALLED, {address, chain, amount});
    trackPromise(
      fetch(
        `/api/sendTokens?address=${address}&chain=${chain}&amount=${amount}`,
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.msg && res.msg !== '') {
            alert(res.msg);
            logEvent(constant.log.REQUEST_EDG_SUCCEED, {address, chain, amount});
          } else {
            logEvent(constant.log.REQUEST_EDG_FAILED, 'ERROR: res or res.msg is null');
            alert('Error: Something went wrong.');
          }
          console.log(res);
        })
        .catch((error) => {
          logEvent(constant.log.REQUEST_EDG_FAILED, {error});
          alert('Error: We are sorry, something went wrong on our side.');
          console.log(error);
        })
        .finally(() => {
          setAddress('');
          setAmount('');
          setLoading(false);
          getFaucetBalance();
        }),
    );
  }

  const handleAddressChange = (e: any) => {
    setAddress(e.target.value);
  };

  const handleAmountChange = (e: any) => {
    if (!isNaN(e.target.value)) setAmount(e.target.value);
  };

  function getMax() {
    setAmount(String(limit));
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(faucetAddress);
  }

  const getFaucetBalance = useCallback(async () => {
  setLoadingBalance(true);
  logEvent(constant.log.GET_BALANCE_CALLED, {});
  await fetch('/api/faucetInfo')
    .then((res) => res.json())
    .then((res) => {
      const parsedBalance = parseFloat(res.balance.replace(/,/g, ''));
      const tokenDecimals = parseInt(process.env.TOKEN_DECIMALS || '18', 10);
      const readableBalance = parseFloat((parsedBalance * Math.pow(10, -tokenDecimals)).toFixed(3));
      setFaucetBalance(readableBalance);
      setFaucetAddress(res.address ? res.address : faucetAddress);
      setLimit(res.max ? res.max : 1);
      logEvent(constant.log.GET_BALANCE_SUCCEED, {balance: readableBalance});
    })
    .catch((err) => {
      console.log(err);
      logEvent(constant.log.GET_BALANCE_FAILED, {error: err});
    })
    .finally(() => {
      setLoadingBalance(false);
    });
}, [faucetAddress]);

useEffect(() => {
  getFaucetBalance();
}, [getFaucetBalance]);

  return (
    <div className="pageBackground">
      <div className="boxContainer">
        <div className="box">
          <div className="upperContainer">
            <div className="headerContainer">
              <img className="logo" src={logo} alt="logo" />
              <div className="header">Edgeware Faucet</div>
            </div>
            <div className="inputFormContainer">
              <div className="field">
                <input
                  className="input"
                  placeholder="Amount"
                  id="Amount"
                  onChange={handleAmountChange}
                  value={amount}
                ></input>
                <div className="maxButton" onClick={getMax}>
                  {' '}
                  MAX{' '}
                </div>
              </div>
              <div className="field">
                <input
                  className="input"
                  placeholder="Address"
                  id="Address"
                  onChange={handleAddressChange}
                  value={address}
                ></input>
              </div>
              <div className="submitButton" onClick={callAPI}>
                {!loading ? 'Request EDG' : <div className="loader"></div>}
              </div>
            </div>
          </div>
          <div className="lowerContainer">
            <div className="faucetBalance">
              Faucet Balance:
              <div className="balanceValue">{loadingBalance ? <div className='loader'></div>: `${faucetBalance} EDG`}</div>
            </div>
            <div className="note">
              To keep this faucet alive, you can donate your excess tokens on
              the below address
              <div className="infoIcon">
                <img className="icon" src={infoIcon} alt="info" />
                <div className="tooltipText">
                  <span className="textWrap">
                    This faucet is powered by the <b>EDGEWARE</b> community, and
                    constantly need support from the community. If you have
                    spare <b>EDG</b> tokens in your <b>Edgeware</b> wallet,
                    then please donate the spare amount to the below address.{' '}
                    <b>Thank you for using this faucet!</b>
                  </span>
                </div>
              </div>
            </div>
            <div className="faucetAddressContainer">
              <div className="faucetAddress">{faucetAddress}</div>
              <div className="copyIconContainer">
                <img
                  className="copyIcon"
                  src={copyIcon}
                  alt="copy"
                  onClick={copyToClipboard}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
