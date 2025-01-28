import React from 'react';
// import { FiCreditCard, FiShoppingCart, FiCheckCircle, FiBox } from 'react-icons/fi';
import './HowToMint.css';
 
const StepCard = ({ Icon, title, description }) => {
  return (
    <div className="mint-card">
      <div className="mint-card-content">
        <img className="mint-icon" src={Icon} />
        <div className="mint-text-content">
          <h3 className="mint-title">{title}</h3>
          <p className="mint-description">{description}</p>
        </div>
      </div>
    </div>
  );
};
 
const HowToMint = () => {
  const steps = [
    {
      Icon: 'artimages/mint-01.png',
      title: 'Connect your wallet',
      description: 'Use Trust Wallet, Metamask, or any wallet to connect to the app.',
    },
    {
      Icon: 'artimages/mint-02.png',
      title: 'Select your quantity',
      description: 'Upload your NFTs and set a title, description, and price.',
    },
    {
      Icon: 'artimages/mint-03.png',
      title: 'Confirm transaction',
      description: 'Earn ETH and BIT for all your NFTs that you sell on our marketplace.',
    },
    {
      Icon: 'artimages/mint-04.png',
      title: 'Receive your NFTs',
      description: 'Receive your NFTs in your wallet after the transaction is confirmed.',
    },
  ];
 
  return (
    <div className="mint-container">
      <h1 className="mint-header">How to mint</h1>
      <div className="mint-steps">
        {steps.map((step, index) => (
          <StepCard
            key={index}
            Icon={step.Icon}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    </div>
  );
};
 
export default HowToMint;