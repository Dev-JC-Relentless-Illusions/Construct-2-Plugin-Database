var Methods = {
    getRoomRef(childKey) {
        var ref = this.database.ref(this.rootPath);
        if (childKey) {
            ref = ref.child(childKey);
        }
        return ref;
    },

    getUserListRef() {
        return this.getRoomRef('users');
    },

    getRoomDataPath(childKey) {
        var path = this.rootPath;
        if (childKey) {
            path += `/${childKey}`;
        }
        return path;
    },

    getUserListPath() {
        return this.getRoomDataPath('users');
    },

    getItemTablePath() {
        return this.getRoomDataPath('table');
    }
}

export default Methods;