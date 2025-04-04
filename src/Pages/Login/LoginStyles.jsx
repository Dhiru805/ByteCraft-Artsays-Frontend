import styled from 'styled-components';
import { Link } from "react-router-dom";


export const ArtsayContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  position: relative;
  background: #fff;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

export const LeftPanel = styled.div`
  width: 50%;
  padding: 80px;
  flex-direction: column;
  display:flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #fff;
//   margin-top: 100px;

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 40px 20px;
    margin-top: 0;
  }
`;

export const RightPanel = styled.div`
  width: 50%;
  padding: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #6b4f36;
  color: white;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 20% 100%);

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 40px 20px;
    clip-path: none;
  }
`;

export const Title = styled.h2`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 30px;
  color: black;

  @media screen and (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

export const SubTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 25px;

  @media screen and (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 15px;
  }
`;

export const SubText = styled.p`
  font-size: 21px;
  font-weight: normal;
  color: #333;
  max-width: 600px;
  margin-bottom: 30px;
  line-height: 1.4;

  @media screen and (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

export const RightText = styled.p`
  font-size: 20px;
  font-weight: normal;
  line-height: 1.4;

  @media screen and (max-width: 768px) {
    font-size: 16px;
  }
`;

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;   
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: border 0.3s ease-in-out;

  &:focus {
    border: 1px solid #6b4f36;
  }

  @media screen and (max-width: 768px) {
    padding: 12px;
  }
`;

export const InputLabel = styled.label`
  position: absolute;
  top: -12px;
  left: 10px;
  font-size: 16px;
  font-style: italic;
  background: white;
  padding: 0 5px;
  color: black;
`;

export const RememberForgot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 25px;

  @media screen and (max-width: 768px) {
    flex-direction: row;
    flex-wrap: nowrap;
  }
`;

export const ForgotPassword = styled.div`
  font-size: 16px;
  cursor: pointer;
  color: #6b4f36;
  white-space: nowrap;
  margin-left: auto;

  @media screen and (max-width: 768px) {
    white-space: nowrap;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  white-space: nowrap;
  margin-right: 10px;
`;

export const CheckboxInput = styled.input`
  margin-right: 10px;
  margin-bottom: 5px;
  width: 16px;
  height: 16px;
  border-radius: 25%;
  appearance: none;
  border: 2px solid #6b4f36;
`;

export const CheckboxLabel = styled.label`
  font-style: italic;
  color: black;
`;

export const AuthButton = styled.button`
  width: 100%;
  background: #6b4f36;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  font-style: italic;

  @media screen and (max-width: 768px) {
    padding: 12px;
    font-size: 16px;
  }
`;

export const SignupButton = styled(Link)`
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 10px 30px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 18px;
  width: 30%;
  font-style: italic;
  margin-top: 25px;
  text-decoration: none;
  text-align: center;

  @media screen and (max-width: 768px) {
    width: 80%;
    padding: 12px;
    font-size: 16px;
    margin-top: 15px;
  }
`;
