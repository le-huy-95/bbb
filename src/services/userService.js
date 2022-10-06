import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPassWord = await bcrypt.hashSync(password, salt);
            resolve(hashPassWord);
        } catch (e) {
            reject(e);
        }
    });
};

let handleUserLogin = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    attributes: ["email", "roleId", "password", "firstName", "lastName"],
                    where: { email: email },
                    raw: true,
                });
                if (user) {
                    //compare password
                    let check = bcrypt.compareSync(password, user.password);
                    // let check = bcrypt.compare(password, user.password);
                    console.log(check);
                    console.log(password);
                    console.log(user.password);

                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";

                        console.log(user);
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User not found`;
                }
            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `email không tồn tại , vui lòng thử với email khác`;
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = "";
            if (userId === "ALL") {
                users = await db.User.findAll({});
            }
            if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewUsers = (data) => {
    console.log(data);
    return new Promise(async(resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            console.log(data);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "Tài khoản đã tồn tại , vui lòng nhập email khác",
                });
            } else {
                let hashPassWordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPassWordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender === "1" ? true : false,
                    roleId: data.roleId,
                });
                resolve({
                    errCode: 0,
                    message: "OK",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        let userAbc = await db.User.findOne({
            where: { id: userId },
        });
        console.log(userAbc);
        if (!userAbc) {
            resolve({
                errCode: 2,
                errMessage: `tai khoan khong ton tai`,
            });
        }

        await db.User.destroy({
            where: { id: userId },
        });

        resolve({
            errCode: 0,
            errMessage: `tai khoan da bi xoa`,
        });
    });
};

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    message: "không có id",
                });
            }
            console.log(data.id);
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            console.log(user);
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();

                resolve({
                    errCode: 0,
                    message: "bạn đã thay đổi thông tin thành công",
                });
            } else {
                resolve({
                    errCode: 1,
                    message: "không tìm đc user",
                });
            }
        } catch (e) {}
    });
};

let getAllCodeService = (type) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!type) {
                resolve({
                    errCode: 1,
                    errMessage: "vui lòng truyền giá trị cần thiết",
                });
            } else {
                let resQ = {};
                let allCode = await db.Allcode.findAll({
                    where: { type: type },
                });
                resQ.errCode = 0;
                resQ.data = allCode;
                resolve(resQ);
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUsers: createNewUsers,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
};