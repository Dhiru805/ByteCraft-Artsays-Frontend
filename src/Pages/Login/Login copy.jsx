import React, { useState, useEffect } from 'react';
import {  useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  ArtsayContainer,
  LeftPanel,
  RightPanel,
  Title,
  SubTitle,
  SubText,
  RightText,
  InputContainer,
  InputField,
  InputLabel,
  RememberForgot,
  ForgotPassword,
  CheckboxContainer,
  CheckboxInput,
  CheckboxLabel,
  AuthButton,
  SignupButton
} from './LoginStyles'; 

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

      const { token, userType, email } = data;

      if (!token || !userType || !email) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('email', email);

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
      <ArtsayContainer>
        <LeftPanel>
          <Title>Login to your Account</Title>
          <SubText>Let's get you all set up so you can <br />start creating your first onboarding experience.</SubText>

          <form onSubmit={handleSubmit} className='w-100'>
            <InputContainer>
              <InputLabel htmlFor="email">Email/Phone</InputLabel>
              <InputField 
                type="text" 
                id="email" 
                required
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </InputContainer>

            <InputContainer>
              <InputLabel htmlFor="password">Password</InputLabel>
              <InputField 
                type="password" 
                id="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputContainer>

            <RememberForgot>
              <CheckboxContainer>
                <CheckboxInput 
                  type="checkbox" 
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <CheckboxLabel htmlFor="remember">Remember Me</CheckboxLabel>
              </CheckboxContainer>
              <ForgotPassword>Forgot Password?</ForgotPassword>
            </RememberForgot>

            <AuthButton type="submit">Login</AuthButton>
          </form>
        </LeftPanel>
        
        <RightPanel>
          <SubTitle>Don't Have An Account?</SubTitle>
          <RightText>Let's get you all set up so you can <br />start creating your first onboarding experience.</RightText>
          <SignupButton to="/register">Sign Up</SignupButton>
        </RightPanel>
      </ArtsayContainer>
    </>
  );
};

export default Login;