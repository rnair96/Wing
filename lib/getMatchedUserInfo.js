const getMatchedUserInfo = (users, userLoggedIn) => {

    const newUsers = Object.values(users).filter( (user)=> user.id  !== userLoggedIn.uid );

    const matchedUser =  Object.entries(newUsers).flat();

    return matchedUser;
}

export default getMatchedUserInfo;