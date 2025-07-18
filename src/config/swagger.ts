import swaggerJSDoc from "swagger-jsdoc";
import { version } from "../../package.json";

const options: swaggerJSDoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Task API Docs",
			version,
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	apis: ["./src/specs/*.yaml"],
	components: ["./src/specs/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;