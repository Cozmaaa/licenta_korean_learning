exports.getUserByCookie = async (req, res) => {
    try {
      const response = await fetch("http://localhost:5000/session/userIdFromCookie", {
        method: "POST",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to verify session");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw error; 
    }
  };