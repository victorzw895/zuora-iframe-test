import { useEffect, useState } from 'react';
import './App.css';
import { Button } from '@mui/material';
import { params } from './params';

const zuoraPaymentHandler = (paymentGateway) => {
  console.log('zuoraPaymentHandler method', paymentGateway);

  return (paymentResponse) => {
    console.log('callback', paymentResponse);
  };
};

function App() {
  const [loaded, setLoaded] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const ZUORA_LIBRARY_URL = 'https://static.zuora.com/Resources/libs/hosted/1.3.1/zuora-min.js';

  useEffect(() => {
    const script = document.createElement('script');
    script.src = ZUORA_LIBRARY_URL;
    script.async = true;
    document.body.appendChild(script);
    setLoaded(false);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const showPage = () => {
    const paymentGateway = "braintree-martian-stg";
    const zuoraSettings = [
      {...params},
      {
        "creditCardHolderName": "VIC ZHANG",
        "creditCardCountry": "AUS"
      },
      zuoraPaymentHandler(paymentGateway),
      (key, code, message, rawGatewayInfo) => {
        const errorMessage = message;
        console.log('error callback', key, code, message, rawGatewayInfo)

        window.Z.sendErrorMessageToHpm(key, errorMessage);
      }
    ]

    console.log(window.Z)
    
    window.Z.renderWithErrorHandler(...zuoraSettings);

    setIframeLoaded(true)
  }

  const submitPage = () => {
    window.Z.submit()
  } 

  return (
    <div className="MMApp">
      <div className="firstTitle">
        <font size="5" style={{marginLeft: '90px', height: '80px'}}>Inline, Submit Button Outside Hosted Page.</font>
      </div>
      <div className="item">
        {!!loaded &&
          <Button 
            id="showPage" 
            onClick={showPage} 
            style={{backgroundColor: '#d8d8d8'}}
          >
            Open Hosted Page
          </Button>
        }
      </div>
      <div className="item">
        <font id="errorMessage" size="3" color="red"></font>
      </div>
      <div className="title">
        <div id="zuora_payment" style={{width: '100%', height: '100%'}}></div>
      </div>
      <div className="item">
        <div id="submit">
          {!!iframeLoaded && 
            <Button 
              id="submitButton" 
              onClick={submitPage} 
              style={{backgroundColor: '#d8d8d8'}}
            >
              Submit
            </Button>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
