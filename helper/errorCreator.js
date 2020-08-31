const errorCreator = (message,status = 500) => (
    {
        status,
        message
    }
)

module.exports = errorCreator