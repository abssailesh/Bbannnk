export const logout = () => {
    document.cookie = 'token=; Max-Age=0; path=/'; // Clear the token
  };
  