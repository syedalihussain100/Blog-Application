const isBlocked = (user) =>{
  if(user?.isBlocked){
    throw new Error(`User Denield ${user?.firstName} is Blocked`)
  }
}


module.exports = isBlocked