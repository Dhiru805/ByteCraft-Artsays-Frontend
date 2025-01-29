import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfileForm = ({ email, phoneNumber, username }) => { 
    const [Email, setNewEmail] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Username, setUsername] = useState('');  

    useEffect(() => {
        setNewEmail(email);
        setPhoneNumber(phoneNumber);
        setUsername(username); 
    }, [email, phoneNumber, username]);  

    return (
        <div className="body">
            <div className="row clearfix">
                <div className="col-lg-6 col-md-12">
                    <h6>Account Data</h6>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            value={Username}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={Email}  
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Phone Number"
                            value={PhoneNumber} 
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileForm;
