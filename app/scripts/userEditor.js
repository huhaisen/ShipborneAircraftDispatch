'use strict'

const ipc = require('electron').ipcRenderer;
const url = require('url');
const path = require('path');
const fs = require("fs");

const newFile_path = path.join(__dirname, 'data/user.json').replace(/\\/g, "\/");

//点击最小化按钮
$(".sys-control-box .sys-btn-minis").click(function () {
    ipc.send('mini-user-editor-window');
});


//默认显示最大窗口
var isBig = false;
//点击最大化按钮
$(".sys-control-box .sys-btn-big").click(function () {
    if (isBig) {
        $(this).css('background', 'url(' + getSmallUrl() + ')');
        ipc.send('turn-small-user-editor');
    } else {
        $(this).css('background', 'url(' + getBigUrl() + ')');
        ipc.send('turn-big-user-editor');
    }
    isBig = !isBig;
});


//点击关闭按钮
$(".sys-control-box .sys-btn-closed").click(function () {
    ipc.send('close-user-editor-window');
});

//接受登陆成功的用户信息，并赋值
ipc.on('loginUserData', function (event, message) {
    let user = JSON.parse(message);
    console.log(user);
    $("#userid input").val(user.id);
    $("#userlid input").val(user.lid);
    $(".username input").val(user.name);
    $(".department input").val(user.department);
    $(".project input").val(user.project);
    $(".telephone input").val(user.telephone);
    $(".email input").val(user.email);
});


$(".saveForm .saveButton").click(function () {
    $(".errorInformation").hide();
    var newPassword = $(".newPassword input").val();
    var isPassword = $(".isPassword input").val();
    if (newPassword == isPassword) {
        var userId = $("#userid input").val();
        var userlId = $("#userlid input").val();
        var username = $(".username input").val();
        var department = $(".department input").val();
        var project = $(".project input").val();
        var telephone = $(".telephone input").val();
        var email = $(".email input").val();
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "http://localhost:8080/DemoWeb/user/updatea.do",
            data: { userId: userId, username: username, department: department, project: project, telephone: telephone, email: email, password: newPassword, lid: userlId },
            error: function () {
                //alert("服务器错误，请稍后重试！");
                updateUserMessage(userlId, username, department, project, telephone, email, newPassword);
            },
            success: function (forward) {
                if (forward.success) {
                    console.info(forward.data);
                    alert("修改成功");
                }
                else {
                    alert(forward.data);
                }
            }
        });

    } else {
        $(".errorInformation").show();
        $(".errorInformation").text("密码不一致，无法提交！");
    }
});



function getBigUrl() {

    const img_small = url.format({
        pathname: path.join(__dirname, 'imgs/turnsmall.png'),
        protocol: 'file',
        slashes: true
    });
    var newUrl = img_small.replace(/\\/g, "\/");

    return newUrl;
}

function getSmallUrl() {
    const img_big = url.format({
        pathname: path.join(__dirname, 'imgs/turnbig.png'),
        protocol: 'file',
        slashes: true
    });
    var newUrl = img_big.replace(/\\/g, "\/");
    return newUrl;
}


function updateUserMessage(userlId, username, department, project, telephone, email, newPassword) {
    if (newPassword == "") {
        var params = {
            "name": username,
            "department": department,
            "project": project,
            "telephone": telephone,
            "email": email,
        }
    } else {
        var params = {
            "name": username,
            "department": department,
            "project": project,
            "telephone": telephone,
            "email": email,
            "password": newPassword
        }
    }
    let result = JSON.parse(fs.readFileSync(newFile_path));
    for (var i in result) {
        if (userlId == result[i].lid) {
            for (var key in params) {
                if (result[i][key]) {
                    result[i][key] = params[key];
                }
            }
        }
    }
    //格式化输出
    let newData = JSON.stringify(result,null,4);
    fs.writeFile(newFile_path, newData, (error) => {
        if (error) {
            console.error(error);
        }
        alert("保存成功");
    });
}