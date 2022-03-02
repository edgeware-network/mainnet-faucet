import React from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useState } from 'react';
import './Body.css';
import logo from "../assets/logo.png";
import infoIcon from "../assets/Info.png";
import copyIcon from "../assets/copy.png";

export default function Body(props){
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const limit = 10;
  
  function callAPI() {
    if(loading)
      return;
    if(amount === '' || address === '') {
      alert('Please properly set amount and address');
      return;
    }
    if(Number(amount) > limit || Number(amount) < 0) {
      alert('Amount can be between 0 - ' + limit);
      return;
    }
    setLoading(true);
    const chain = 'beresheet';
    trackPromise((fetch(`https://faucet.seedcode.io/api/sendTokens?address=${address}&chain=${chain}&amount=${amount}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.msg !== '') { alert(res.msg) }
      }).catch((error) => {
        alert('Error: We are sorry, something went wrong on our side.');
        console.log(error);
      }).finally(() => {
        setAddress('');
        setAmount('');
        setLoading(false);
      })));
  }

  const handleAddressChange = (e: any) => {
    setAddress(e.target.value);
  }

  const handleAmountChnage = (e: any) => {
    if(!isNaN(e.target.value))
      setAmount(e.target.value);
  }

  function getMax() {
    setAmount(String(limit));
  }

  function copyToClipboard() {
    navigator.clipboard.writeText('n881YjFMbhqx6sZtQXqJdVBzS3wfRrdZzK55HJ8Z6beMJr6');
  }

  function getFaucetBalance() {

  }
  
    return (
      <div className='pageBackground'>
        <div className='boxContainer'>
          <div className='box'>
            <div className='upperContainer'>
              <div className='headerContainer'>
                <img className='logo' src={logo} alt="logo"/>
                <div className='header'>Beresheet Faucet</div>
              </div>
              <div className='inputFormContainer'>
                <div className='field'>
                  <input className='input' placeholder='Amount' id='Amount' onChange={handleAmountChnage} value={amount}></input>
                  <div className='maxButton' onClick={getMax}> MAX </div>
                </div>
                <div className='field'>
                  <input className='input' placeholder='Address' id='Address' onChange={handleAddressChange} value={address}></input>
                </div>
                <div className='submitButton' onClick={callAPI}>
                  { !loading ? "Request EDG"
                    :<div className='loader'></div>
                  }
                </div>
              </div>
            </div>
            <div className='lowerContainer'>
              <div className='faucetBalance'>
                Faucet Balance: 
                <div className='balanceValue'>250 EDG</div>
              </div>
              <div className='note'> 
                To keep this faucet alive, you can donate your excess tokens on the below address
                <div className='infoIcon'>
                  <img className='icon' src={infoIcon} alt="info"/>
                  <div className='tooltipText'>
                    <span className='textWrap'>
                      This faucet is powered by the <b>EDGEWARE</b> community, and constantly need support from the community. If you have unused <b>EDG</b> tokens on your <b>Beresheet</b> wallet, then please donate the excess amount to the below address. <b>Thank you for using this faucet!</b>
                    </span>
                  </div>
                </div>
              </div>
              <div className='faucetAddressContainer'>
                <div className='faucetAddress'>
                  n881YjFMbhqx6sZtQXqJdVBzS...
                </div>
                <div className='copyIconContainer'>
                  <img className='copyIcon' src={copyIcon} alt="copy" onClick={copyToClipboard}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="boxContainer">
          <div className="box">
            <h4>Beresheet Faucet</h4>
            <label style={{ marginTop: "auto" }}>Enter Wallet Address</label>
            <input onChange={this.handleChange} type="text" placeholder="0x0" style={{ height: '40px' }} />
            <button onClick={this.callAPI.bind(this)} type="button" className="btn_Submit">Submit</button>
            <LoadingSpinnerComponent />
          </div>
        </div >
        <div className="textContainer">
          {/* <MadeWithLove
            by="Furqan"
            emoji
            link='https://flow.page/FurqanAhmed'
          />*/}
          {/* <p className="textContainer">Made with ❤️ by <a href="https://flow.page/FurqanAhmed" target="_blank"> Furqan </a> - Powered by <a href="https://github.com/edgeware-builders" target="_blank"> Edgeware Builders </a></p>
        </div>
        <ForkMeOnGithub repo="https://github.com/edgeware-builders/beresheet-faucet-frontend" />  */}


      </div >
    );
}

