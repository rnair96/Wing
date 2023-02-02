const getMatchedUserInfo = (users, userLoggedIn) => {

    console.log("did you get herre?")

    const newUsers = Object.values(users).filter( (user)=> user.id  !== userLoggedIn );

    const matchedUser =  Object.entries(newUsers).flat();

    console.log("matchedUser",matchedUser)

    return matchedUser;
}

export default getMatchedUserInfo;