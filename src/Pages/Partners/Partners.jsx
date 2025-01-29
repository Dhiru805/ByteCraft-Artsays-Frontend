import React from 'react'
import PartnerMainection from './sub/PartnerMainection'
import PartnerLogomain from './sub/PartnerLogomain'
import PartnerSupportsection from './sub/PartnerSupportsection'
import IntegrationPartners from './sub/IntergrationPartners'
import PartnerResources from './sub/PartnerResources'
import FAQ from '../../Component/FAQ/FAQ'
 
 
const Partners = () => {
  return (
    <>
     <div id="pageWrapper">
     <main className='Partner'>
    <PartnerMainection/>
    <PartnerLogomain/>
    <PartnerSupportsection/>
    <IntegrationPartners/>
    <PartnerResources/>
    <FAQ/>
    </main>
    </div>
   
    </>
  )
}
 
export default Partners