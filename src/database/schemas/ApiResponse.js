const { RESOLVER } = require('awilix')
const { Schema } = require('mongoose')
const apiResponseSchema = new Schema({
    code: Number,
    error: String,
    data: String
})

const apiResponseModel = ({ database: mongoose }) => mongoose.model('HeartRate', apiResponseSchema)
module.exports = apiResponseModel

apiResponseModel[RESOLVER] = {
    name: 'apiResponseSchema'
}
