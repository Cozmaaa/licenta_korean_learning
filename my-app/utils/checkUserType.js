exports.checkUserType = async () => {
    try {
      const userId = await getUserByCookie();
      console.log(userId)

      // Send the user ID to the backend to check user type
      const response = await axios.post(
        "http://localhost:5000/user/isAdmin",
        {
          userId: userId,
        }
      );

      const { isAdmin } = response.data;
      return isAdmin;

    } catch (error) {
      console.error("Error checking user type:", error);

    }
  };