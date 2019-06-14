import { QueuedCommand } from "../../../../QueuedCommand";
export type QueuedCommandWithPassword = QueuedCommand & PasswordField;
interface PasswordField {
    password: string;
}
