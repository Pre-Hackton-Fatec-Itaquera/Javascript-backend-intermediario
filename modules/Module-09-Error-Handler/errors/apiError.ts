// src/errors/apiError.ts
export class apiError extends Error {
    constructor(
        message: string,
        public status: number
    ){
        super(message);

        // Corrige o nome do erro para o nome da subclasse real
        // (ex: "NotFoundError" em vez de "Error").
        // Sem isso, `error.name` sempre voltaria "Error", porque é
        // isso que a classe nativa `Error` define por padrão.
        this.name = this.constructor.name;
    }
}