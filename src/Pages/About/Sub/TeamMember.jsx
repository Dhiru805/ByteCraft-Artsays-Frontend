import React from "react";
import Employee from "../../../server/Employee.json"; // Adjust the path as needed

const TeamMembers = () => {
    return (
        <section className="teamSec abtSecHolder pt-xl-12 pb-xl-21 pt-lg-10 pb-lg-20 pt-md-8 pb-md-16 pt-0 pb-4">
            <div className="container">
                <div className="row ">
                    <header className="col-12 mainHeader mb-9 text-center">
                        <h1 className="headingIV playfair fwEblod mb-4">Meet Our Team</h1>
                        <span className="headerBorder d-block mb-5">
                            <img src="images/hbdr.png" alt="Header Border" className="img-fluid img-bdr"/>
                        </span>
                    </header>
                </div>
                <div className="rows d-flex flex-wrap mr-0 ml-0">
                    {Employee.map((member, index) => (
                        <div key={index} className="col-12 col-sm-6 col-lg-4 mb-lg-0 mb-6">
                            <article className="teamBlock overflow-hidden">
                                <span className="imgWrap position-relative d-block mb-4">
                                    <img src={member.imageSrc} className="img-fluid" alt={member.name} />
                                    <ul className="list-unstyled position-absolute mb-0 d-flex justify-content-center socialNetworks">
                                        {member.facebook && <li><a href={member.facebook} className="fab fa-facebook-f"></a></li>}
                                        {member.twitter && <li><a href={member.twitter} className="fab fa-twitter"></a></li>}
                                        {member.instagram && <li><a href={member.instagram} className="fab fa-instagram"></a></li>}
                                    </ul>
                                </span>
                                <div className="textDetail w-100 text-center">
                                    <h3>
                                        <strong className="text-uppercase d-block fwEbold name mb-2">
                                            <a href="#">{member.name}</a>
                                        </strong>
                                        <strong className="text-capitalize d-block desination">{member.designation}</strong>
                                    </h3>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TeamMembers;
