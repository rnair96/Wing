const checkFlagged = (user_flags) => {
    let check = false;
    for(let i =0;i<user_flags.length;i++){
        if(user_flags[i].status==="unresolved"){
            check=true;
        }
    }
    return check;
}

export default checkFlagged;