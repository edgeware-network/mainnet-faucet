import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import MadeWithLove from 'react-made-with-love';
import ForkMeOnGithub from 'fork-me-on-github';
import { LoadingSpinnerComponent } from '../index';
import './Body.css';
import logo from "../assets/logo.png";
import infoIcon from "../assets/Info.png";
import copyIcon from "../assets/copy.png";
class Body extends Component {
  state = {
    apiResponse: { trxHash: '', msg: '' },
    address: ''
  };
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = { apiResponse: { trxHash: '', msg: '' }, address: '' };
  }
  async callAPI() {
    const { address } = this.state;
    const chain = 'beresheet';
    trackPromise((fetch(`https://faucet.seedcode.io/api/sendTokens?address=${address}&chain=${chain}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({ apiResponse: res }); if (res.msg !== '') { alert(res.msg) }
      }).catch((error) => {
        alert('Error: We are sorry, something went wrong on our side.')
        console.log(error)
      })));
  }

  handleChange = (e: any) => {
    this.setState({ address: e.target.value });
  }

  componentDidUpdate() {
    setTimeout(() => this.setState({ apiResponse: { trxHash: '', msg: '' } }), 10000);
  }

  copyToClipboard() {
    navigator.clipboard.writeText('n881YjFMbhqx6sZtQXqJdVBzS3wfRrdZzK55HJ8Z6beMJr6');
  }

  render() {
    return (
      <div className='pageBackground'>
        <div className='boxContainer'>
          <div className='box'>
            <div className='upperContainer'>
              <div className='headerContainer'>
                <img className='logo' src={logo}/>
                <div className='header'>Beresheet Faucet</div>
              </div>
              <div className='inputFormContainer'>
                <div className='field'>
                  <input className='input' placeholder='Amount' id='Amount'></input>
                  <div className='maxButton'> MAX </div>
                </div>
                <div className='field'>
                  <input className='input' placeholder='Address' id='Address'></input>
                </div>
                <div className='submitButton'>
                  Request EDG
                </div>
              </div>
            </div>
            <div className='lowerContainer'>
              <div className='faucetBalance'>
                Faucet Balance: 
                <div className='balanceValue'>250 EDG</div>
              </div>
              <div className='note'> 
                To keep this faucet alive, you can donate your excess tokens on the below address.
                <div className='infoIcon'>
                  <img className='icon' src={infoIcon}/>
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
                  <img className='copyIcon' src={copyIcon} onClick={this.copyToClipboard}/>
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
}

export default Body;
