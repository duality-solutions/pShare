export interface ValidationApi {
    validate(userName: string): Promise<boolean>
    getNumber(): Promise<number>
}