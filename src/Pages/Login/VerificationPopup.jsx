import  { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import getAPI from '../../api/getAPI';
import { toast } from 'react-toastify'; 

const VerificationPopup = ({ show, onHide }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = useAuth();

  const profilePath = userType === 'Artist' ? '/artist/profile' : '/seller/profile';

  const userId = location.state?._id || localStorage.getItem('userId');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    if (location.state?._id) {
      localStorage.setItem('userId', location.state._id);
    }
  }, [location.state]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const result = await getAPI(`/auth/userid/${userId}`, {}, true, false);
      if (result.data.user) {
        const userData = result.data.user;
        setProfileData({
          ...userData,
        });

      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error fetching profile data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Complete Your Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {profileData.status === 'Rejected' ? (
          <>
            <p>Your profile verification has been rejected.</p>
            <p>
              <strong>Reason:</strong> {profileData.Rejcectcomment || 'No comment provided.'}
            </p>
            <p>Please update your profile to address the issues and resubmit for verification.</p>
          </>
        ) : (
          <p>Please complete your profile to verify your account.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            console.log('Navigating to:', profilePath);
            navigate(profilePath, { replace: true });
            onHide();
          }}
          style={{ backgroundColor: '#6b4f36', borderColor: '#6b4f36' }}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Complete Profile'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VerificationPopup;