const { app, BrowserWindow, Menu, globalShortcut, ipcMain } = require('electron')

//Set environment
process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isWindows = process.platform === 'win32' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow
let aboutWindow

function createMainWindow(){
    mainWindow = new BrowserWindow({
        title:'ImageShrink',
        width:500,
        height:600,
        icon: './assets/icons/Icon_256x256.png',
        resizable: isDev ? true : false,
        backgroundColor: 'white',
        webPreferences: {
            nodeIntegration: true,
        },
    })

    //if(isDev){
    //    mainWindow.webContents.openDevTools()
    //}

    mainWindow.loadURL(`file://${__dirname}/app/index.html`)
    //mainWindow.loadFile('./app/index.html')
}

function createAboutWindow(){
    aboutWindow = new BrowserWindow({
        title:'About ImageShrink',
        width:300,
        height:300,
        icon: './assets/icons/Icon_256x256.png',
        resizable: false,
        backgroundColor: 'white'
    })

    aboutWindow.loadURL(`file://${__dirname}/app/about.html`)
    //aboutWindow.loadFile('./app/about.html')
}

app.on('ready', () => {
    createMainWindow()

    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    //no need of this shortcuts since developermenu is enabled
    //globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload())
    //globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I', () => mainWindow.toggleDevTools())

    mainWindow.on('ready', () => mainWindow = null)
})

const menu = [
    ...(isMac ? [
        { 
            label: app.name,
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow
                }
            ]
        }
    ] : []),
    {
        role: 'fileMenu'
    },
    ...(!isMac ? [
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow
                }
            ]
        }
    ] : []),
    ...(isDev ? [ 
        {
            label: 'Developer',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { type: 'separator' },
                { role: 'toggledevtools' }
            ]
        } 
    ] : [])
]

ipcMain.on('image:minimize', (e, options) => {
    console.log(options)
})

app.on('window-all-closed', () => {
    if(!isMac){
        app.quit()
    }
})

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0){
        createMainWindow()
    }
})
