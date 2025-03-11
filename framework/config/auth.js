module.exports = {
    rolesKey: 'roles',
    primaryKey: 'id',
    sessionKey: 'web',
    permissions: {
        user: [
            { path: "/.*", methods: "any", type: "allow" }
        ]
    }
};