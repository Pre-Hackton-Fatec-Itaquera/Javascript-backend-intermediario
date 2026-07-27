import { apiError } from "./apiError.ts";

export class BadRequestError extends apiError {
    constructor(message = "Requisição inválida.") {
        super(message, 400)
    }
}