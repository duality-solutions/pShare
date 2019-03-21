import { DeniedLink } from "./DeniedLink";
export interface LinkDeniedResponse {
    list_updated_epoch: number;
    list_updated: string;
    denied_list: Record<string, DeniedLink>;
}
