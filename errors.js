
exports.API_ENDPOINT_NOT_FOUND_ERR = "Api endpoint does not found";

exports.SERVER_ERR = "Something went wrong";

exports.AUTH_HEADER_MISSING_ERR = "auth header is missing";

exports.AUTH_TOKEN_MISSING_ERR = "auth token is missing";

exports.JWT_DECODE_ERR = "incorrect token";

exports.USER_NOT_FOUND_ERR = "User not found";

exports.INCORRECT_PASSWORD = "Password is incorrect"


exports.ACCESS_DENIED_ERR = "Access deny for normal user";

exports.getErrors = (name) => {
    try{
      let str = JSON.stringify(name["message"]) 
      const regex = /"/gi;
      errorMessage =  str.replace(regex,"")
      console.log(errorMessage)
      if(errorMessage.includes("ast to Number failed ")){
        errorMessage = "only numbers allowed"
      }
      return errorMessage
    }
    catch{
      return null
    }
  }

  exports.userExistErrors = (err) => {
    if(err.includes("E11000 duplicate key error collection:")){
      return true
    }
  }
 