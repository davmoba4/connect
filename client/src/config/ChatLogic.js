export const containsFull = (list, user) => {
  return list.some((elem) => {
    return JSON.stringify(user._id) === JSON.stringify(elem._id);
  });
};

export const contains = (list, user) => {
  return list.some((elem) => {
    return JSON.stringify(user) === JSON.stringify(elem);
  });
};

export const getSenderUsername = (loggedUser, users) => {
  return users[0]._id === loggedUser._id
    ? users[1].username
    : users[0].username;
};

export const getSenderObject = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isOtherSenderEnd = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isOtherLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const senderMargin = (messages, m, i, userId) => {
  // if it's a message in the middle for other user, more margin left
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  // if it's the last message of other user, no margin since there's an avatar
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  // if it's the current user, align to the right
  else return "auto";
};

export const isFromSameUser = (messages, m, i, userId) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
