module.exports = {
    session: 'user',
    rolekey: "roles",
    visible: ['id', 'roles', 'username', 'nickname'],
    permissions: {
        admin: [
            { path: "/.*", methods: "any", type: "allow" }
        ]
    }
};