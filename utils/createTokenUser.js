
const createTokenUser = ({name, role , _id})=>{
    return {name, role, userId:_id};
}

module.exports = createTokenUser;