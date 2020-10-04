import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { LoadingSpinnerComponent } from '../index';
import './Body.css';

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
    trackPromise((fetch(`http://54.164.96.51:9000/api/sendTokens?address=${address}&chain=${chain}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({ apiResponse: res }); if (res.msg !== '') { alert(res.msg) }
      })));
  }

  handleChange = (e: any) => {
    this.setState({ address: e.target.value });
  }

  componentDidUpdate() {
    setTimeout(() => this.setState({ apiResponse: { trxHash: '', msg: '' } }), 10000);
  }

  render() {
    return (
      <div className="boxContainer">
        <div className="box">
          <h4>Beresheet Faucet</h4>
          <label style={{ marginTop: "auto" }}>Enter Wallet Address</label>
          <input onChange={this.handleChange} type="text" placeholder="0x0" style={{ height: '40px' }} />
          <button onClick={this.callAPI.bind(this)} type="button" className="btn_Submit">Submit</button>
          <LoadingSpinnerComponent />
        </div>
      </div >
    );
  }
}

export default Body;
