import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [isNetPresent, setIsNetPresent] = useState(null);
  const [decodedToken, setDecodedToken] = useState([]);

  return (
    <UserContext.Provider value={{
      token,
      setToken,
      isNetPresent,
      setIsNetPresent,
      decodedToken,
      setDecodedToken
     }}>
      {children}    
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);