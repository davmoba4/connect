/*
 *@description     Checks whether a list of users contains a given user
 *                 by comparing the ID
 *@params          list: the list of users (list of User/User-like JSON object)
 *                 user: the user (User/User-like JSON object)
 *@returns         whether the list contains the user (Boolean)
 */
export const containsFull = (list, user) => {
  return list.some((elem) => {
    return JSON.stringify(user._id) === JSON.stringify(elem._id);
  });
};

/*
 *@description     Checks whether a list of users contains a given user
 *                 by comparing the whole object
 *@params          list: the list of users (list of User/User-like JSON object)
 *                 user: the user (User/User-like JSON object)
 *@returns         whether the list contains the user (Boolean)
 */
export const contains = (list, user) => {
  return list.some((elem) => {
    return JSON.stringify(user) === JSON.stringify(elem);
  });
};

/*
 *@description     Gets the username of the user other than the current user
 *                 in a one-on-one chat
 *@params          loggedUser: the current user (User)
 *                 users: the list of users for the chat (list of User)
 *@returns         the username of the other user (String)
 */
export const getSenderUsername = (loggedUser, users) => {
  return users[0]._id === loggedUser._id
    ? users[1].username
    : users[0].username;
};

/*
 *@description     Gets the user other than the current user
 *                 in a one-on-one chat
 *@params          loggedUser: the current user (User)
 *                 users: the list of users for the chat (list of User)
 *@returns         the other user (User)
 */
export const getSenderObject = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

/*
 *@description     Returns whether the message is at the end of another
 *                 user's concurrent messages
 *@params          messages: the messages for the chat (list of Message)
 *                 m: the current message (Message)
 *                 i: the index of the current message (int)
 *                 userId: the ID of the current user (Object ID)
 *@returns         whether the message is at the end of another user's
 *                 concurrent messages (Boolean)
 */
export const isOtherSenderEnd = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

/*
 *@description     Returns whether the current message is the last message
 *                 and it is from another user
 *@params          messages: the messages for the chat (list of Message)
 *                 i: the index of the current message (int)
 *                 userId: the ID of the current user (Object ID)
 *@returns         whether the message is the last message and it's from
 *                 another user (Boolean)
 */
export const isOtherLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

/*
 *@description     Returns the appropriate margin for a message
 *@params          messages: the messages for the chat (list of Message)
 *                 m: the current message (Message)
 *                 i: the index of the current message (int)
 *                 userId: the ID of the current user (Object ID)
 *@returns         the margin (int or String)
 */
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

/*
 *@description     Returns whether the current message is from the same user
 *                 as the last
 *@params          messages: the messages for the chat (list of Message)
 *                 m: the current message (Message)
 *                 i: the index of the current message (int)
 *@returns         whether the message is from the same user as the last (Boolean)
 */
export const isFromSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
