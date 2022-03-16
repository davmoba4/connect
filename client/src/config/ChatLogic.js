export const getSenderUsername = (loggedUser, users) => {
  return users[0]._id === loggedUser._id
    ? users[1].username
    : users[0].username;
};

export const getSenderObject = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
