// import React, { useState } from "react";

// const TermsPolicyContent = () => {
//   const [showFilters, setShowFilters] = useState(false);

//   return (
//     <main className="md:col-span-3">
//       {/* title */}
//       <h1 className="text-sm md:text-4xl font-bold text-orange-500">
//         Privacy Policy
//       </h1>

//       <hr className="my-3 border-dark" />

//       {/* Subtitle */}
      // <p className="mt-3 text-xs md:text-base font-medium text-black leading-relaxed">
      //   At ArtSays, your privacy matters to us. This Privacy Policy explains how
      //   we collect, use, and protect your personal information when you visit
      //   our platform, engage in challenges, purchase artwork, or use any of our
      //   services.
      //   <br />
      //   Personal Details: Name, email, phone number, billing and shipping
      //   address. Payment Info: Processed securely through trusted third-party
      //   gateways. Usage Data: Browsing activity, device info, cookies, and
      //   preferences to improve your experience. User Content: Artwork
      //   submissions, comments, feedback, and profile information.
      //   <br />
      //   To process and deliver your orders. To communicate updates, offers, and
      //   challenge notifications. To personalize your ArtSays experience. To
      //   ensure platform safety, detect fraud, and comply with legal obligations.
      //   At ArtSays, your privacy matters to us. This Privacy Policy explains how
      //   we collect, use, and protect your personal information when you visit
      //   our platform, engage in challenges, purchase artwork, or use any of our
      //   services.
      //   <br />
      //   Personal Details: Name, email, phone number, billing and shipping
      //   address. Payment Info: Processed securely through trusted third-party
      //   gateways. Usage Data: Browsing activity, device info, cookies, and
      //   preferences to improve your experience. User Content: Artwork
      //   submissions, comments, feedback, and profile information.
      //   <br />
      //   To process and deliver your orders. To communicate updates, offers, and
      //   challenge notifications. To personalize your ArtSays experience. To
      //   ensure platform safety, detect fraud, and comply with legal obligations.
      //   At ArtSays, your privacy matters to us. This Privacy Policy explains how
      //   we collect, use, and protect your personal information when you visit
      //   our platform, engage in challenges, purchase artwork, or use any of our
      //   services.
      //   <br />
      //   Personal Details: Name, email, phone number, billing and shipping
      //   address. Payment Info: Processed securely through trusted third-party
      //   gateways. Usage Data: Browsing activity, device info, cookies, and
      //   preferences to improve your experience. User Content: Artwork
      //   submissions, comments, feedback, and profile information.
      //   <br />
      //   To process and deliver your orders. To communicate updates, offers, and
      //   challenge notifications. To personalize your ArtSays experience. To
      //   ensure platform safety, detect fraud, and comply with legal obligations.
      //   At ArtSays, your privacy matters to us. This Privacy Policy explains how
      //   we collect, use, and protect your personal information when you visit
      //   our platform, engage in challenges, purchase artwork, or use any of our
      //   services.
      //   <br />
      //   Personal Details: Name, email, phone number, billing and shipping
      //   address. Payment Info: Processed securely through trusted third-party
      //   gateways. Usage Data: Browsing activity, device info, cookies, and
      //   preferences to improve your experience. User Content: Artwork
      //   submissions, comments, feedback, and profile information.
      //   <br />
      //   To process and deliver your orders. To communicate updates, offers, and
      //   challenge notifications. To personalize your ArtSays experience. To
      //   ensure platform safety, detect fraud, and comply with legal obligations.
      //   At ArtSays, your privacy matters to us. This Privacy Policy explains how
      //   we collect, use, and protect your personal information when you visit
      //   our platform, engage in challenges, purchase artwork, or use any of our
      //   services.
      //   <br />
      //   Personal Details: Name, email, phone number, billing and shipping
      //   address. Payment Info: Processed securely through trusted third-party
      //   gateways. Usage Data: Browsing activity, device info, cookies, and
      //   preferences to improve your experience. User Content: Artwork
      //   submissions, comments, feedback, and profile information.
      //   <br />
      //   To process and deliver your orders. To communicate updates, offers, and
      //   challenge notifications. To personalize your ArtSays experience. To
      //   ensure platform safety, detect fraud, and comply with legal obligations.
      //   At ArtSays, your privacy matters to us. This Privacy Policy explains how
      //   we collect, use, and protect your personal information when you visit
      //   our platform, engage in challenges, purchase artwork, or use any of our
      //   services.
      //   <br />
      //   Personal Details: Name, email, phone number, billing and shipping
      //   address. Payment Info: Processed securely through trusted third-party
      //   gateways. Usage Data: Browsing activity, device info, cookies, and
      //   preferences to improve your experience. User Content: Artwork
      //   submissions, comments, feedback, and profile information.
      //   <br />
      //   To process and deliver your orders. To communicate updates, offers, and
      //   challenge notifications. To personalize your ArtSays experience. To
      //   ensure platform safety, detect fraud, and comply with legal obligations.
      // </p>
//     </main>
//   );
// };
// export default TermsPolicyContent;
//=====================================================original UI above============

import React, { useState, useEffect } from "react";
import axios from "../../../api/axiosConfig";

const TermsPolicyContent = ({ selectedPolicyId }) => {
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    if (!selectedPolicyId) {
      setPolicy(null);
      return;
    }

    const fetchPolicy = async () => {
      try {
        const res = await axios.get(`/api/getPolicy/${selectedPolicyId}`);
        if (!res.data.hasError && res.data.data) {
          let description = res.data.data.description;

          description = description.replace(
            /<\/h[1-6]>/g,
            '</h2><hr class="my-3 border-dark" />'
          );

          setPolicy({ ...res.data.data, description });
        } else {
          console.error("Error fetching policy:", res.data.message);
          setPolicy(null);
        }
      } catch (err) {
        console.error("Error fetching policy:", err);
        setPolicy(null);
      }
    };

    fetchPolicy();
  }, [selectedPolicyId]);

  if (!policy) {
    return <p className="p-4">Select a policy to view details.</p>;
  }

  return (
    <main>
      {/* <h1 className="text-sm md:text-4xl font-bold text-orange-500">
        {policy.title}
      </h1>
      <hr className="my-3 border-dark" /> */}

      {/* Scoped styles for headings */}
      <style>
        {`
          .policy-content h1,
          .policy-content h2,
          .policy-content h3 {
            font-size: 1rem; /* text-sm */
            font-weight: 700; /* font-bold */
            color: #f97316;   /* text-orange-500 */
          }
          @media (min-width: 768px) {
            .policy-content h1,
            .policy-content h2,
            .policy-content h3 {
              font-size: 2rem; /* md:text-2xl */
            }
          }
        `}
      </style>

      <div
        className="policy-content text-xs md:text-base font-medium text-black leading-relaxed"
        dangerouslySetInnerHTML={{ __html: policy.description }}
      />
    </main>
  );
};

export default TermsPolicyContent;
