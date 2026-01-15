import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import putAPI from '../../../../../../api/putAPI';

const UserProfileForm = ({ userId, email, phoneNumber, username }) => { 
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [Email, setNewEmail] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Username, setUsername] = useState('');  

    useEffect(() => {
        setNewEmail(email);
        setPhoneNumber(phoneNumber);
        setUsername(username); 
    }, [email, phoneNumber, username]);  

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error('New password and confirm password do not match');
            return;
        }

        try {
            const payload = {
                currentPassword,
                newPassword,
                confirmPassword,
                email: Email,
                phoneNumber: PhoneNumber,
                username: Username  
            };
            const url = `/auth/users/${userId}`;
            const result = await putAPI(url, payload);

            if (result.hasError) {
                toast.error(result.message);  
            } else {
                toast.success(result.message);  
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            toast.error('Error changing password');
        }
    };
    
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
                            fdprocessedid="du108l"
                            value={Username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={Email}  
                            onChange={(e) => setNewEmail(e.target.value)}
                            style={{
                                backgroundImage: 'url("data:image/png',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 20,
                                backgroundPosition: '97% center',
                                cursor: 'auto',
                            }}
                            data-temp-mail-org={0}
                            fdprocessedid="yelneg"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Phone Number"
                            value={PhoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                            fdprocessedid="eszxtb"
                        />
                    </div>
                </div>
                <div className="col-lg-6 col-md-12">
                    <h6>Change Password</h6>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            fdprocessedid="mc3qbb"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fdprocessedid="dwmakn"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fdprocessedid="ccwtcy"
                        />
                    </div>
                </div>
            </div>
            <button type="button" className="btn btn-primary mx-2" onClick={handleSubmit} fdprocessedid="3awnjs">Update</button>
            {/* <button className="btn btn-default" fdprocessedid="a5rynt">Cancel</button> */}
        </div>
    );
};

export default UserProfileForm;
