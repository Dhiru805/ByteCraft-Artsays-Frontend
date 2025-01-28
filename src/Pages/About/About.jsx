import React from "react";
import Breadcrumb from "../../Component/Breadcrumb";
import TeamMembers from "./Sub/TeamMember";
import ProgressReport from "./Sub/ProgressReport";
import CompanyObjective from "./Sub/CompanyObjective";
import DeliveryProcess from "./Sub/DeliveryProcess";
import FAQ from "../../Component/FAQ/FAQ";
import Testimonial from "../../Component/Testinomial/Testimonial";

const About = () => {
  return (
    <>
      <div id="pageWrapper">
        <main>
          
          <ProgressReport />
          <CompanyObjective />
          <DeliveryProcess />
          <TeamMembers />
          <Testimonial/>
          <FAQ />
        </main>
      </div>
    </>
  );
};

export default About;
