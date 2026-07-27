import { apiError } from "./apiError.ts";

export class UnauthorizedError extends apiError {
    constructor(message = "Não autorizado.") {
        super(message, 401)
    }
}