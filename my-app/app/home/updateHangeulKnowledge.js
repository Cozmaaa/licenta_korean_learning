async function updateHangeulKnowledge(username) {
  try {
    // Replace `your-api-endpoint` with the actual endpoint you want to call
    const response = await fetch("http://localhost:5000/user/setKnowsHangeul", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        knowsHangeul: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user information");
    }

    // Handle the successful API call as needed, perhaps with a success message
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle error cases, such as showing an error message to the user
  }
}

export default updateHangeulKnowledge;
