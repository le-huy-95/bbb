import userService from "../services/userService";

let handleLoging = async(req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing inputs parameter!",
        });
    }

    let userData = await userService.handleUserLogin(email, password);
    //check email exist
    //password nhap vao ko dung
    //return userInfor
    // access_token :JWT json web token

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
};

let handleGetAllUser = async(req, res) => {
    let id = req.query.id; // all , single /láy 1 gia tri hay toan gia tri user
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "chua co",
            users,
        });
    }

    let users = await userService.getAllUser(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: "ok",
        users,
    });
};

let handleCreateNewUser = async(req, res) => {
    let mesApi = await userService.createNewUsers(req.body);
    console.log(mesApi);
    return res.status(200).json(mesApi);
};
let handleEditNewUser = async(req, res) => {
    let data = req.body;
    let messages = await userService.updateUserData(data);
    return res.status(200).json(messages);
};
let handleDeleteUser = async(req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "vui lòng điền id",
        });
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
};

let getAllCode = async(req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
        console.log(data);
    } catch (e) {
        console.log("lỗi là :", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "không thể kết nối đến server",
        });
    }
};
module.exports = {
    handleLoging: handleLoging,
    handleGetAllUser: handleGetAllUser,
    handleCreateNewUser: handleCreateNewUser,
    handleEditNewUser: handleEditNewUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
};