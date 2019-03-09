import React, { FunctionComponent } from "react";

export interface FileInfo{
    path:string
    type:string
}

export interface DropzoneStateProps {

}
export interface DropzoneDispatchProps {
    filesSelected: (filePaths: FileInfo[]) => void
}
export type DropzoneProps = DropzoneStateProps & DropzoneDispatchProps

export const Dropzone: FunctionComponent<DropzoneProps> = ({ filesSelected }) =>
    <div
        style={{ width: 200, height: 100, borderStyle: "dotted", borderWidth: 5, position: "relative", cursor: "pointer" }}
        onDragOver={e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        }}
        onDrop={e => {
            e.preventDefault();
            filesSelected([...e.dataTransfer.files].map(f => ({path:f.path,type:f.type})))
        }}>

        <input
            type="file"
            id="fileElem"
            multiple
            accept="*/*"
            onChange={e => {
                e.preventDefault();
                e.currentTarget.files && filesSelected([...e.currentTarget.files].map(f => ({path:f.path,type:f.type})))
            }}
            style={({ display: "none" })} />
        <label
            style={{ width: "100%", height: "100%", display: "block", cursor: "pointer" }}
            className="button"
            htmlFor="fileElem">
            drop or click to add a file
        </label>
    </div>;
