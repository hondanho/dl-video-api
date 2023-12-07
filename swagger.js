const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = [
    './source/routes/posts.ts',
    './source/routes/youtube.ts'
]

swaggerAutogen(outputFile, endpointsFiles )