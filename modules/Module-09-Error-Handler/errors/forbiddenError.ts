import { apiError } from "./apiError.ts";

export class ForbiddenError extends apiError {
    constructor(message = "Acesso proibido.") {
        super(message, 403)
    }
}