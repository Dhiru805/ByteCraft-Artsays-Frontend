import React, { useState } from 'react';
// import './Register.css';
// Import toast from react-toastify if you're using it for notifications
import { toast, ToastContainer } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    emailOrPhone: '',
    password: '',
    retypePassword: '',
    acceptTerms: false,
  });
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRadioChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.lastName || !formData.emailOrPhone || !formData.password || !formData.retypePassword || !userType || !formData.acceptTerms) {
      setError('All fields are required.');
      return;
    }

    if (formData.password !== formData.retypePassword) {
      setError('Passwords do not match.');
      return;
    }

    const isEmail = /\S+@\S+\.\S+/.test(formData.emailOrPhone);
    const isPhone = /^\d+$/.test(formData.emailOrPhone);

    if (!isEmail && !isPhone) {
      setError('Please enter a valid email or phone number.');
      return;
    }

    const fullFormData = {
      ...formData,
      email: isEmail ? formData.emailOrPhone : 'null',
      phone: isPhone ? formData.emailOrPhone : 'null',
      userType,
    };

    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await response.json();
      console.log('Server Response:', data);
      // Store tokens in local storage or session storage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      toast.success('Registration Successful!', {
        onClose: () => {
          setTimeout(() => {
            window.location.href = '/login'; // Redirect to login page after 5 seconds
          }, 5000);
        },
      });

      // Reset form data
      setFormData({
        name: '',
        lastName: '',
        emailOrPhone: '',
        password: '',
        retypePassword: '',
        acceptTerms: false,
      });
      setUserType(''); // Reset user type
      setError(''); // Clear any error messages
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div id="pageWrapper">
      <main>
        <section className="introSec bg-lightGray pb-xl-7 pt-20 pb-10 mb-6 text-center">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-6 mb-lg-0 mb-6 pt-lg-5">
                <img src="images/img81.png" alt="image description" className="img-fluid pt-5" />
              </div>
              <div className="col-12 col-lg-6">
                <div className="d-flex justify-content-center align-items-center mt-5">
                  <div className="container">
                    <div className="tab-content" id="pills-tabContent">
                      <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                        <form className="form" onSubmit={handleSubmit}>
                          {error && <div className="alert alert-danger">{error}</div>}
                          <div className="mb-4 tab-radio-group">
                            <input
                              type="radio"
                              id="buyer"
                              name="userType"
                              value="Buyer"
                              checked={userType === 'Buyer'}
                              onChange={handleRadioChange}
                            />
                            <label htmlFor="buyer">Buyer/Collector</label>

                            <input
                              type="radio"
                              id="artist"
                              name="userType"
                              value="Artist"
                              checked={userType === 'Artist'}
                              onChange={handleRadioChange}
                            />
                            <label htmlFor="artist">Artist</label>
                          </div>
                          <div className="d-flex">
                            <input
                              type="text"
                              name="name"
                              className="form-control mb-6 bg-light transparent-input mx-0 mr-6"
                              placeholder="Name"
                              value={formData.name}
                              onChange={handleChange}
                              autoComplete="given-name"
                            />
                            <input
                              type="text"
                              name="lastName"
                              className="form-control mb-6 bg-light transparent-input mx-0"
                              placeholder="Last Name"
                              value={formData.lastName}
                              onChange={handleChange}
                              autoComplete="family-name"
                            />
                          </div>
                          <input
                            type="text"
                            name="emailOrPhone"
                            className="form-control mb-6 bg-light transparent-input"
                            placeholder="Email or Phone"
                            value={formData.emailOrPhone}
                            onChange={handleChange}
                            autoComplete="email"
                          />
                          <div className="password-container mb-6">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              className="form-control bg-light transparent-input"
                              placeholder="Create Password"
                              value={formData.password}
                              onChange={handleChange}
                              autoComplete="new-password"
                            />
                            <i
                              className={`password-toggle-icon ${showPassword ? "fa fa-eye-slash" : "fa fa-eye"}`}
                              onClick={toggleShowPassword}
                            ></i>
                          </div>
                          <div className="password-container mb-6">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="retypePassword"
                              className="form-control bg-light transparent-input"
                              placeholder="Retype Password"
                              value={formData.retypePassword}
                              onChange={handleChange}
                              autoComplete="new-password"
                            />
                            <i
                              className={`password-toggle-icon ${showPassword ? "fa fa-eye-slash" : "fa fa-eye"}`}
                              onClick={toggleShowPassword}
                            ></i>
                          </div>
                          <div className="form-group form-check mb-3">
                            <input
                              type="checkbox"
                              name="acceptTerms"
                              className="form-check-input"
                              checked={formData.acceptTerms}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label">
                              I accept the <a href="#">terms and conditions</a>.
                            </label>
                          </div>
                          <button type="submit" className="btn btn-success btn-block mb-6">REGISTER</button>
                          <div className="row mb-6">
                            <div className="col d-flex justify-content-center">
                              <div className="text-center">
                                <p>Already a member <a href="Login.html">Login</a></p>
                                <p>or sign up with:</p>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                  <i className="fab fa-facebook-f text-success"></i>
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                  <i className="fab fa-google text-success"></i>
                                </button>
                                <button type="button" className="btn btn-link btn-floating mx-1">
                                  <i className="fab fa-twitter text-success"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ToastContainer />
    </div>
  );
};

export default Register;
