import React from "react";
import LoadingSpinner from "./ui-elements/LoadingSpinner";

export const Main: React.FunctionComponent = () =>
    <>
        <h1>main page</h1>
        <LoadingSpinner active label="This page is not implemented." size={50} />
    </>