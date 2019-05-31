import React from "react";
import { LoadingSpinner } from "../ui-elements/LoadingSpinner";

export const CreatingBdapAccount: React.SFC = () => (
    <>
        <LoadingSpinner active label="Creating your BDAP Account ... " size={50} />
    </>
)
