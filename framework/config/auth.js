module.exports = {
    session: 'user',
    rolekey: "roles",
    visible: ['id', 'roles', 'username', 'nickname'],
    permissions: {
        user: [
            { path: "/.*", methods: "any", type: "allow" }
        ]
    }
};