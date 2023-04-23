'use strict'

const ipc = require('electron').ipcRenderer;
const url = require('url');
const path = require('path');
const fs = require("fs");

$(".loginForm .loginButton").click(function () {
    $(".errorInformation").hide();
    var username = $.trim($(".username .textInput").val());
    var password = $.trim($(".password .textInput").val());

    if (username == "") {
        $(".errorInformation").show();
        $(".errorInformation").text("请输入账号");
        $(".username .textInput").focus();
        return false;
    }

    if (password == "") {
        $(".errorInformation").show();
        $(".errorInformation").text("请输入密码");
        $(".password .textInput").focus();
        return false;
    }
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "http://localhost:8080/DemoWeb/user/loginss.do",
        data: { username: username, password: password },
        error: function () {
            console.info("当前访问的是本地文件登录");
            readFilePath(username, password);
        },
        success: function (forward) {
            console.info("当前访问的是服务器登录");
            if (forward.success) {
                //打开新的窗口
                let userData = JSON.stringify(forward.data);
                ipc.send('open-user-editor', userData);
            }
            else {
                $(".errorInformation").show();
                $(".errorInformation").text("用户名或密码错误!");
            }
        }
    });
});


function readFilePath(username, password) {

    var loginFlag = false;
    const newFile_path = path.join(__dirname, 'data/user.json').replace(/\\/g, "\/");

    fs.exists(newFile_path, function (exists) {
        console.log(exists ? "文件存在" : "文件不存在");
        if (!exists) {
            $(".errorInformation").show();
            $(".errorInformation").text("查找失败，本地文件不存在!");
            return;
        } else {
            let result = JSON.parse(fs.readFileSync(newFile_path));
            for (var i in result) {
                if ((result[i].lid == username) && (result[i].password == password)) {
                    let data = JSON.stringify(result[i]);
                    ipc.send('open-user-editor', data);
                    loginFlag = true;
                    break;
                }
            }
            if (!loginFlag) {
                $(".errorInformation").show();
                $(".errorInformation").text("用户名或密码错误!");
            }
        }
    });
}

