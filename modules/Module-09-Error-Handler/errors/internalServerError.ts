import { apiError } from "./apiError.ts";

export class InternalServerError extends apiError {
    constructor(message = "Erro interno do servidor.") {
        super(message, 500)
    }
}