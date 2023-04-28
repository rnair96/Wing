const checkFlagged = (user_flags) => {
    console.log("flags", user_flags.length)
    let check = false;
    for(let i =0;i<user_flags.length;i++){
        if(user_flags[i].status==="unresolved"){
            check=true;
        }
    }
    console.log("check",check)
    return check;
}

export default checkFlagged;