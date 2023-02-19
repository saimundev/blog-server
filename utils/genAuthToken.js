import jwt from "jsonwebtoken";

const genAuthToken = (user) => {
  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
    },
    process.env.SECRIT
  );
  return token;
};

export default genAuthToken;
