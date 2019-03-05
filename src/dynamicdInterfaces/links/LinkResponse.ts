import { Link } from "./Link";
export interface LinkResponse<T extends Link> {
    [id: string]: T;
}
