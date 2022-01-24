function conditionalFlash(intro) {
    if (intro === "\"password\" is not allowed to be empty")
        return {
            intro: 'Password Field Empty! ',
            message: 'Please enter your password'

        }
    if (intro === "\"email\" is not allowed to be empty")
        return {
            intro: 'Email Field Empty! ',
            message: 'Please enter your email'
        }

    if (intro === "\"email\" must be a valid email")
        return {
            intro: 'Email Invalid! ',
            message: 'Please enter a valid email'
        }
    if (intro === "\"username\" is not allowed to be empty")
        return {
            intro: 'Username Field Empty! ',
        }
    if (intro === "\"password\" length must be at least 7 characters long")
        return {
            intro: 'Password Too Short! ',
        }
}

function signFlash(intro) {
    if (intro === "Operation `users.insertOne()` buffering timed out after 10000ms") {
        throw new Error('Database Server Error');
    }
    else return {
        intro: 'Email is already registered to an account ',
    }

}

function genericFlash(value) {
    switch (value) {
        case 1:
            return {
                type: "success",
                intro: "Login Successful"
            }
        case 2:
            return {
                intro: "Invalid Email or Password!",
                message: "Please Try Again"
            }
        case 3:
            return {
                type: "success",
                intro: "Account Created Successfully"
            }
        case 4:
            return {
                intro: "Passwords Did Not Match!",
                message: "Please Try Again"
            }
        default:
            break;
    }

}




module.exports.conditionalFlash = conditionalFlash;
module.exports.genericFlash = genericFlash;
module.exports.signFlash = signFlash;
