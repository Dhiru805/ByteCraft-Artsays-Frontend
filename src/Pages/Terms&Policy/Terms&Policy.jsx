import React, { useState } from "react";
import HeroImgTermsPolicy from "./hero-img/hero-img";
import TermsPolicySidebar from "./Terms&PolicySidebar/Terms&PolicySidebar";
import TermsPolicyContent from "./TermsPolicyContent/TermsPolicyContent";

const TermsPolicyPage = () => {
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);

  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">
      <HeroImgTermsPolicy />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-3 sm:px-6 mt-6">
        <TermsPolicySidebar
          selectedPolicyId={selectedPolicyId}
          onSelect={setSelectedPolicyId}
        />
        <main className="md:col-span-3">
          <TermsPolicyContent selectedPolicyId={selectedPolicyId} />
        </main>
      </div>
    </div>
  );
};

export default TermsPolicyPage;
