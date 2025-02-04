// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from "react-router-dom";
// // import './Login.css';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
 
// const Login = () => {
//   const [input, setInput] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(true);
//   const [userType, setUserType] = useState('option1'); // Default to 'option1'
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if user is logged in
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token'); // Example of token stored in localStorage
//     if (token) {
//       setIsLoggedIn(true);
//     }
//   }, []);
 
//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const response = await fetch('http://localhost:3001/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ emailOrPhone: input, password }),
//       });
  
//       const data = await response.json();
//       console.log(data); // Debug response
  
//       const { token, userType } = data;
  
//       if (!token || !userType) {
//         throw new Error('Invalid response from server');
//       }
  
//       // Store token and userType in localStorage
//       localStorage.setItem('token', token);
//       localStorage.setItem('userType', userType);
  
//       setIsLoggedIn(true);
//       setUserType(userType);
  
//       toast.success('Login Successful!');
//       navigate(`/${userType}/Dashboard`);
//     } catch (error) {
//       console.error('Login error:', error.message);
//       toast.error(`Error logging in: ${error.message}`);
//     }
//   };
  
//   const handleLogout = () => {
//     localStorage.removeItem('token'); // Remove the token from localStorage
//     setIsLoggedIn(false); // Set logged in status to false
//     alert('Logged out successfully!');
//   };
 
//   return (
//     <>
//     <ToastContainer />
//     <div id="pageWrapper">
//       <main>
//         <section className="introSec bg-lightGray  pb-xl-20  pb-lg-20 py-md-16 py-10  text-center">
//           <div className="container">
//             <div className="row">
//               <div className="col-12 col-lg-6 mb-lg-0 mb-6">
//                 <img src="artimages/LoginImg.webp" alt="image description" className="img-fluid" />
//               </div>
//               <div className="col-12 col-lg-6">
//                 <div className="d-flex justify-content-center align-items-center mt-5">
//                   <div className="container">
//                     {isLoggedIn ? (
//                       <div>
//                         <h2>You are already logged in!</h2>
//                         <button className="btn btn-danger" onClick={handleLogout}>
//                           Logout
//                         </button>
//                       </div>
//                     ) : (
//                       <form className="form px-4 pt-0" onSubmit={handleSubmit}>
//                         <div className='login-heading mb-2 p-2 headingIV '>Login
//                         </div>
//                         <input
//                           type="text"
//                           name="emailOrPhone"
//                           className="form-control mb-6 bg-light transparent-input"
//                           placeholder="Email or Phone"
//                           value={input}
//                           onChange={(e) => setInput(e.target.value)}
//                         />
//                         <input
//                           type="password"
//                           name="password"
//                           className="form-control mb-6 bg-light transparent-input"
//                           placeholder="Password"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                         />
//                         <button type="submit" className="btn btn-success btn-block mb-6">Login</button>
//                         <div className="row mb-6">
//                           <div className="col d-flex justify-content-center">
//                             <div className="form-check">
//                               <input
//                                 className="form-check-input"
//                                 type="checkbox"
//                                 value=""
//                                 id="form2Example31"
//                                 checked={rememberMe}
//                                 onChange={(e) => setRememberMe(e.target.checked)}
//                               />
//                               <label className="form-check-label" htmlFor="form2Example31"> Remember me </label>
//                             </div>
//                           </div>
//                           <div className="col">
//                             <a href="#!">Forgot password?</a>
//                           </div>
//                         </div>
//                         <div className="text-center">
//                           <p>Not a member? <Link to="/register">Register</Link></p>
//                           <p>or sign up with:</p>
//                           <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
//                             <i className="fab fa-facebook-f text-success"></i>
//                           </button>
//                           <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
//                             <i className="fab fa-google text-success"></i>
//                           </button>
//                           <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
//                             <i className="fab fa-twitter text-success"></i>
//                           </button>
//                         </div>
//                       </form>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//     </>
//   );
// };
 
// export default Login;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (token && userType) {
      navigate(`/${userType}/Dashboard`); 
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: input, password }),
      });

      const data = await response.json();
      console.log(data); 

      const { token, userType } = data;

      if (!token || !userType) {
        throw new Error('Invalid response from server');
      }

  
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);

      toast.success('Login Successful!');
      navigate(`/${userType}/Dashboard`);
    } catch (error) {
      console.error('Login error:', error.message);
      toast.error(`Error logging in: ${error.message}`);
    }
  };

  return (
    <>
      <ToastContainer />
      <div id="pageWrapper">
        <main>
          <section className="introSec bg-lightGray pb-xl-20 pb-lg-20 py-md-16 py-10 text-center">
            <div className="container">
              <div className="row">
                <div className="col-12 col-lg-6 mb-lg-0 mb-6">
                  <img src="artimages/LoginImg.webp" alt="image description" className="img-fluid" />
                </div>
                <div className="col-12 col-lg-6">
                  <div className="d-flex justify-content-center align-items-center mt-5">
                    <div className="container">
                      <form className="form px-4 pt-0" onSubmit={handleSubmit}>
                        <div className='login-heading mb-2 p-2 headingIV '>Login</div>
                        <input
                          type="text"
                          name="emailOrPhone"
                          className="form-control mb-6 bg-light transparent-input"
                          placeholder="Email or Phone"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                        />
                        <input
                          type="password"
                          name="password"
                          className="form-control mb-6 bg-light transparent-input"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="btn btn-success btn-block mb-6">Login</button>
                        <div className="row mb-6">
                          <div className="col d-flex justify-content-center">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="form2Example31"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                              />
                              <label className="form-check-label" htmlFor="form2Example31"> Remember me </label>
                            </div>
                          </div>
                          <div className="col">
                            <a href="#!">Forgot password?</a>
                          </div>
                        </div>
                        <div className="text-center">
                          <p>Not a member? <Link to="/register">Register</Link></p>
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
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Login;
