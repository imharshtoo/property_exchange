const validateUsername = (username) => {
    const regex = /^[a-z0-9]+$/;
    return regex.test(username);
  };
  
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  
export { validateUsername, validatePassword };
  