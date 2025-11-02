// config.js
import { useState, useEffect } from 'react';

const useUserType = () => {
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const storedUserType = localStorage.getItem("userType");
        if (storedUserType) {
            setUserType(storedUserType);
        }
    }, []);

    return userType;
};

export default useUserType;

