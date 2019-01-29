export interface ValidationApi {
    validate(username: string): Promise<boolean>
}