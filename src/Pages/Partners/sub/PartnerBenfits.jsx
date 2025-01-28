import React from 'react';
import './PartnerBenifits.css';

const PartnerBenfits = () => {
  return (
    <div className='partner-benifits-section2'>
      <div className='partner-benifits'>
        <div>
          <h1 className='p-5 display-4'>Boost your outcomes with partner benefits</h1>
        </div>
        <div className='partner-benifits-content p-5 m-2'>
          <a href="#" className='partner-benifits-card'>
            <h3 className='text-center  card-title'>Reach new audiences</h3>
            <p className='text-center cart-discription'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos!</p>
          </a>
          <a href="#" className='partner-benifits-card'>
            <h3 className='text-center card-title'>Drive revenue</h3>
            <p className='text-center cart-discription'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam, ad?</p>
          </a>
          <a href="#" className='partner-benifits-card'>
            <h3 className='text-center card-title'>Build your brand</h3>
            <p className='text-center cart-discription'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem aperiam vero ut perspiciatis quas veritatis.</p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default PartnerBenfits;
