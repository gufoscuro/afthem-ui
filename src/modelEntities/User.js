
module.exports.schema = {
    username: {
        nullable: false,
        type: 'text'
    },
    password: {
        nullable: false,
        type: 'password'
    },
    firstName: {
        nullable: false,
        type: 'text'
    },
    lastName: {
        nullable: false,
        type: 'text'
    },
    enabled: {
        nullable: false,
        type: 'boolean',
        defaultValue: true
    },
    level: {
        nullable: false,
        // type: 'int',
        type: 'select',
        defaultValue: 0
    },
    gitUsername: {
        nullable: false,
        type: 'text'
    },
    gitPassword: {
        nullable: false,
        type: 'text'
    }
}