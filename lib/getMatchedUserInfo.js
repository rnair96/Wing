const getMatchedUserInfo = (users, userLoggedIn) => {

    // const newUsers = Object.values(users).filter( (user)=> user.id  !== userLoggedIn );

    // const matchedUser =  Object.entries(newUsers).flat();

    // return matchedUser;

    const newUsers = users.filter((user) => user !== userLoggedIn);

    // Since newUsers is now an array of IDs, you don't need to flatten or use Object.entries.
    // You can directly return the newUsers array.

    return newUsers[0];
}

export default getMatchedUserInfo;