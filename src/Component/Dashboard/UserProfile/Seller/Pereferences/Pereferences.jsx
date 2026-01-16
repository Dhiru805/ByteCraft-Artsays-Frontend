import React, { useState, useEffect } from 'react';
import getAPI from '../../../../../api/getAPI';
import deleteAPI from '../../../../../api/deleteAPI';
import { toast } from 'react-toastify';

const Preferences = ({ userId }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const id = userId || localStorage.getItem('userId');
      const response = await getAPI(`/auth/sessions/${id}`, {}, true);
      if (response && response.data) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [userId]);

  const handleRevokeSession = async (sessionId) => {
    try {
      const response = await deleteAPI(`/auth/sessions/${sessionId}`, {}, true);
      if (response && response.message === "Session revoked successfully") {
        toast.success("Session revoked successfully");
        setSessions(sessions.filter(s => s._id !== sessionId));
      }
    } catch (error) {
      console.error("Error revoking session:", error);
      toast.error("Error revoking session");
    }
  };

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Mobile': return 'fa-mobile';
      case 'Tablet': return 'fa-tablet';
      default: return 'fa-laptop';
    }
  };

  return (
    <div className="tab-pane" id="preferences">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12">
          <div className="body">
            <h6>Your Login Sessions</h6>
            {loading ? (
              <p>Loading sessions...</p>
            ) : sessions.length === 0 ? (
              <p>No active sessions found.</p>
            ) : (
              <ul className="list-unstyled list-login-session">
                {sessions.map((session) => (
                  <li key={session._id}>
                    <div className="login-session">
                      <i className={`fa ${getDeviceIcon(session.device)} device-icon`} />
                      <div className="login-info">
                        <h3 className="login-title">
                          {session.device} - {session.location} ({session.ipAddress})
                        </h3>
                        <span className="login-detail">
                          {session.browser} -{" "}
                          <span className={session.status === 'active' ? 'text-success' : ''}>
                            {session.status === 'active' ? 'Active' : session.status}
                          </span>
                          <br />
                          <small>Last active: {new Date(session.lastActive).toLocaleString()}</small>
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-link btn-logout"
                        onClick={() => handleRevokeSession(session._id)}
                        title="Close this login session"
                      >
                        <i className="fa fa-times-circle text-danger" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
