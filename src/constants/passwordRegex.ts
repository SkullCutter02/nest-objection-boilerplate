export const passwordRegex = {
  regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  message: "Password needs to have a minimum of 8 characters, one letter and one number",
};
