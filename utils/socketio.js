const socketio = require("socket.io");
class MySocketIOService {
    constructor(server) {
        if (!MySocketIOService._instance) {
            MySocketIOService._instance = this;
        }

        this.io = socketio(server);
        this.usernameSocketMap = new Map();
        this.socketUsernameMap = new Map();
        this.setupSocketIOHelper();

        return MySocketIOService._instance;
    }

    static getInstance() {
        return this._instance;  
    }

    setupSocketIOHelper() {
        this.io.on("connection", (socket) => {   
            console.log('A user connected');
            socket.on('bindUserNameWithSocket', (username) => {
                console.log('username binding with socket connection');
                if (this.usernameSocketMap.has(username)) {
                    this.usernameSocketMap.delete(username);
                    this.socketUsernameMap.delete(socket);
                }
                this.usernameSocketMap.set(username, socket);
                this.socketUsernameMap.set(socket, username);
            });    
        
            socket.on('disconnect', () => {
                console.log('user disconnected');
                if (this.socketUsernameMap.has(socket)) {
                    const username = this.socketUsernameMap.get(socket);
                    this.usernameSocketMap.delete(username);
                    this.socketUsernameMap.delete(socket);
                }
            });
        });
    }
    
    pushMsg(msg) {
        return new Promise((resolve, reject) => {
            this.usernameSocketMap.forEach((socket, username, map)=>{
                socket.emit('public message', msg);
            })
            resolve("msg pushed");
            // reject(err);
        })
    } 

    pushMsgToUser(msg, topic, username) {
        return new Promise((resolve, reject) => {
            if (this.usernameSocketMap.has(username)) {
                const sokcet = this.usernameSocketMap.get(username);
                sokcet.emit(topic, msg);
                resolve("msg pushed to " + username);
            }else{
                resolve("user is not online");
            }
            
        })

    }
    // pushMsg(msg, username) {
    //     return new Promise((resolve, reject) => {
    //         const socket = this.usernameSocketMap.get(username);
    //         socket.emit(msg);
    //         resolve("msg pushed to " + username);
    //     })
    // }   

    updateStatus(status, name) {
        return new Promise((resolve, reject) => {
            this.usernameSocketMap.forEach((socket, username, map)=>{
                socket.emit('update status', [status, name]);
            })
            resolve("update status");
        })
    } 

    // (dynamic update) If user login or logout, broadcast the updated userlist to all online users
    updateUserlist() {
        return new Promise((resolve, reject) => {
            this.usernameSocketMap.forEach((socket, username, map)=>{
                socket.emit('update userlist');
            })
            resolve("update userlist");
        })
    } 

    removeSocket(username) {
        return new Promise((resolve, reject) => {
            if (this.usernameSocketMap.has(username)) {
                this.usernameSocketMap.get(username).disconnect();
            }
            resolve("socket removed");
            // reject(err);
        });

    }     
}

module.exports = MySocketIOService;

