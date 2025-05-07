const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Are You Employable API',
      version: '1.0.0',
      description: 'API documentation for Are You Employable application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: `https://${process.env.BASE_URL}`,
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

export default swaggerOptions;