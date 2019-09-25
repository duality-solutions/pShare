import { SharedFile } from "../../shared/types/SharedFile";

import { fileListToTree } from "../../shared/system/file/fileListToTree";
import { getDirectoryListing } from "../../shared/system/file/getDirectoryListing";

const testData = [
    "/home/user1/Documents/bandwidths.ods",
    "/home/user1/Documents/invoices/HID-001.odt",
];

const mappedTestData: SharedFile[] = testData.map<SharedFile>(path => ({
    sharedWith: "string",
    relativePath: path,
    path,
    size: 123,
    contentType: "string",
    direction: "out"
}))

const expectedEntries=[{
    "type": "file",
    "name": "HID-001.odt",
    "fileInfo": {
        "sharedWith": "string",
        "relativePath": "/home/user1/Documents/invoices/HID-001.odt",
        "path": "/home/user1/Documents/invoices/HID-001.odt",
        "size": 123,
        "contentType": "string",
        "direction": "out"
    }
}]

test("getDirectoryListing", () => {
    var root = fileListToTree(mappedTestData)
    var directoryListing = getDirectoryListing("/home/user1/Documents/invoices", root)
    expect(directoryListing).toEqual(expectedEntries)
    var directoryListing2 = getDirectoryListing("/home/user1/Documents/invoices/", root)
    expect(directoryListing2).toEqual(expectedEntries)
})