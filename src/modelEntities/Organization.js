module.exports.schema = {
    name: {
        nullable: false,
        type: 'text'
    },
    description: {
        nullable: true,
        type: 'text'
    },
    timezone: {
        nullable: false,
        type: 'select',
        defaultValue: 'GMT'
    }
}