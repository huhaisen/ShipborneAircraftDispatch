'use strict'

const electron = require('electron');
const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');
// const user32 = require('./app/scripts/user32').User32
// const remote = require('electron').remote;
const ipc = electron.ipcMain;

let mainWindow = null;

//创建登录窗口
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 535,
		height: 500,
		transparent: true,
		frame: false,
		resizable: false,
		maximizable: false,
	});

	//mainWindow.once('ready-to-show',()=>{
	//let hwnd= mainWindow.getNativeWindowHandle();
	//user32.GetSystemMenu(hwnd.readUInt32LE(0),true)
	//mainWindow.show();
	//})

	const URL = url.format({
		pathname: path.join(__dirname, 'app/index.html'),
		protocol: 'file',
		slashes: true
	});

	mainWindow.loadURL(URL);

	//mainWindow.webContents.openDevTools();

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

}



let userEditorWindow = null;

//监听是否打开该窗口
ipc.on('open-user-editor', (event,message) => {

	if (mainWindow) {
		mainWindow.hide();
	}

	if (userEditorWindow) {
		return;
	}
	//创建用户编辑窗口
	userEditorWindow = new BrowserWindow({
		frame: false,
		height: 600,
		//resizable:false,
		width: 500,
		//maximizable:true,
	});
	const user_edit_url = url.format({
		pathname: path.join(__dirname, 'app/showUser.html'),
		protocol: 'file',
		slashes: true
	});

	userEditorWindow.loadURL(user_edit_url);

	userEditorWindow.webContents.openDevTools();

	if(message!=undefined){
		userEditorWindow.webContents.on('did-finish-load', function () {
			userEditorWindow.webContents.send('loginUserData', message);
		});
	}

	userEditorWindow.on('closed', () => {
		userEditorWindow = null;
	});

});



//接收最小化通信
ipc.on('mini-user-editor-window', () => {
	userEditorWindow.minimize();
});

ipc.on('turn-small-user-editor', () => {
	userEditorWindow.unmaximize();
});

ipc.on('turn-big-user-editor', () => {
	userEditorWindow.maximize();
});


//修改用户窗口点击关闭时触发
ipc.on('close-user-editor-window', () => {
	if (userEditorWindow) {
		userEditorWindow.close();
	}
	if (mainWindow) {
		mainWindow.destroy();
		app.quit();
	}

});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow == null) {
		createWindow();
	}

});
