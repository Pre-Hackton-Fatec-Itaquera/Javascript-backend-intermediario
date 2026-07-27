import { apiError } from "./apiError.ts";

export class NotFoundError extends apiError {
    constructor(message = "Recurso não encontrado.") {
        super(message, 404)
    }
}