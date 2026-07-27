import { apiError } from "./apiError.ts";

export class ConflictError extends apiError {
    constructor(message = "Conflito com o estado atual do recurso.") {
        super(message, 409)
    }
}