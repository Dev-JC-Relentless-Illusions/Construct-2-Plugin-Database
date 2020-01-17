import EventEmitterMethods from '../../../utils/eventemitter/EventEmitterMethods.js';
import GetValue from '../../../utils/object/GetValue.js';
import CreateUserList from './utils/CreateUserList.js';
import CreateBroadcast from './utils/CreateBroadcast.js';
import CreateItemTable from './utils/CreateItemTable.js';
import IsPlainObject from '../../../utils/object/IsPlainObject.js';
import Methods from './Methods.js';

class SingleRoom {
    constructor(config) {
        // Event emitter
        var eventEmitter = GetValue(config, 'eventEmitter', undefined);
        var EventEmitterClass = GetValue(config, 'EventEmitterClass', undefined);
        this.setEventEmitter(eventEmitter, EventEmitterClass);

        this.database = firebase.database()
        this.rootPath = GetValue(config, 'root', '');

        // User properties
        this.userInfo = { userID: '', userName: '' };
        this.setUser(GetValue(config, 'userID', ''), GetValue(config, 'userName', ''));
        // Room properties
        this.leftRoomFlag = false;
        // User list
        this.userList = CreateUserList.call(this, config);
        // Broadcast
        this.broadcast = CreateBroadcast.call(this, config);
        // Item table
        this.itemTable = CreateItemTable.call(this, config);
    }

    shutdown() {
    }

    destroy() {
        this.shutdown();
    }

    get userID() {
        return this.userInfo.userID;
    }

    set userID(value) {
        this.userInfo.userID = value;
    }

    get userName() {
        return this.userInfo.userName;
    }

    set userName(value) {
        this.userInfo.userName = value;
    }

    setUser(userID, userName) {
        if (IsPlainObject(userID)) {
            this.userInfo = userID;
        } else {
            this.userID = userID;
            this.userName = userName;
        }
        return this;
    }

    isInRoom() {
        return this.userList.isInList;
    }

    get maxUsers() {
        return this.userList.maxUsers;
    }

    get isFirstUser() {
        return this.isInRoom() && this.userList.isFirstUser(this.userID);
    }
}

Object.assign(
    SingleRoom.prototype,
    EventEmitterMethods,
    Methods
);
export default SingleRoom;