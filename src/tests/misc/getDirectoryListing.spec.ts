import { SharedFile } from "../../shared/types/SharedFile";

import { fileListToTree } from "../../shared/system/file/fileListToTree";
import { getDirectoryListing } from "../../shared/system/file/getDirectoryListing";

const testData = [
    "home/user1/Documents/bandwidths.ods",
    "home/user1/Documents/invoices/HID-001.odt",
    "magic/home/user1/Documents/invoices/HID-001.odt",
];

const mappedTestData: SharedFile[] = testData.map<SharedFile>(path => ({
    sharedWith: "string",
    relativePath: path,
    path,
    size: 123,
    contentType: "string",
    direction: "out"
}))

const expectedEntries = [{
    "type": "file",
    "name": "HID-001.odt",
    "fileInfo": {
        "sharedWith": "string",
        "relativePath": "home/user1/Documents/invoices/HID-001.odt",
        "path": "home/user1/Documents/invoices/HID-001.odt",
        "size": 123,
        "contentType": "string",
        "direction": "out"
    }
}]
const expectedEntries1 = [{
    "type": "file",
    "name": "HID-001.odt",
    "fileInfo": {
        "sharedWith": "string",
        "relativePath": "magic/home/user1/Documents/invoices/HID-001.odt",
        "path": "magic/home/user1/Documents/invoices/HID-001.odt",
        "size": 123,
        "contentType": "string",
        "direction": "out"
    }
}]

const expectedEntries2 = [
    {
        "type": "file",
        "name": "bandwidths.ods",
        "fileInfo": {
            "sharedWith": "string",
            "relativePath": "home/user1/Documents/bandwidths.ods",
            "path": "home/user1/Documents/bandwidths.ods",
            "size": 123,
            "contentType": "string",
            "direction": "out"
        }
    },
    {
        "name": "invoices",
        "type": "directory",
        "entries": [
            {
                "type": "file",
                "name": "HID-001.odt",
                "fileInfo": {
                    "sharedWith": "string",
                    "relativePath": "home/user1/Documents/invoices/HID-001.odt",
                    "path": "home/user1/Documents/invoices/HID-001.odt",
                    "size": 123,
                    "contentType": "string",
                    "direction": "out"
                }
            }
        ]
    }
]

const rootEntry = [
    {
        "name": "home",
        "type": "directory",
        "entries": [
            {
                "name": "user1",
                "type": "directory",
                "entries": [
                    {
                        "name": "Documents",
                        "type": "directory",
                        "entries": [
                            {
                                "type": "file",
                                "name": "bandwidths.ods",
                                "fileInfo": {
                                    "sharedWith": "string",
                                    "relativePath": "home/user1/Documents/bandwidths.ods",
                                    "path": "home/user1/Documents/bandwidths.ods",
                                    "size": 123,
                                    "contentType": "string",
                                    "direction": "out"
                                }
                            },
                            {
                                "name": "invoices",
                                "type": "directory",
                                "entries": [
                                    {
                                        "type": "file",
                                        "name": "HID-001.odt",
                                        "fileInfo": {
                                            "sharedWith": "string",
                                            "relativePath": "home/user1/Documents/invoices/HID-001.odt",
                                            "path": "home/user1/Documents/invoices/HID-001.odt",
                                            "size": 123,
                                            "contentType": "string",
                                            "direction": "out"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "magic",
        "type": "directory",
        "entries": [
            {
                "name": "home",
                "type": "directory",
                "entries": [
                    {
                        "name": "user1",
                        "type": "directory",
                        "entries": [
                            {
                                "name": "Documents",
                                "type": "directory",
                                "entries": [
                                    {
                                        "name": "invoices",
                                        "type": "directory",
                                        "entries": [
                                            {
                                                "type": "file",
                                                "name": "HID-001.odt",
                                                "fileInfo": {
                                                    "sharedWith": "string",
                                                    "relativePath": "magic/home/user1/Documents/invoices/HID-001.odt",
                                                    "path": "magic/home/user1/Documents/invoices/HID-001.odt",
                                                    "size": 123,
                                                    "contentType": "string",
                                                    "direction": "out"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

test("getDirectoryListing", () => {
    const root = fileListToTree(mappedTestData)
    //console.log(JSON.stringify(root,null,2))
    {
        const directoryListing = getDirectoryListing("home/user1/Documents/invoices", root)
        expect(directoryListing).toEqual(expectedEntries)
        // const directoryListing2 = getDirectoryListing("/home/user1/Documents/invoices/", root)
        // expect(directoryListing2).toEqual(expectedEntries)
    }
    {
        const directoryListing = getDirectoryListing("magic/home/user1/Documents/invoices", root)
        expect(directoryListing).toEqual(expectedEntries1)
        // const directoryListing2 = getDirectoryListing("magic/home/user1/Documents/invoices/", root)
        // expect(directoryListing2).toEqual(expectedEntries1)
    }
    {
        const directoryListing = getDirectoryListing("home/user1/Documents", root)
        expect(directoryListing).toEqual(expectedEntries2)
        // const directoryListing2 = getDirectoryListing("/home/user1/Documents/", root)
        // expect(directoryListing2).toEqual(expectedEntries2)
    }
    {
        const directoryListing = getDirectoryListing("", root)
        expect(directoryListing).toEqual(rootEntry)
        // const directoryListing2 = getDirectoryListing("/home/user1/Documents/", root)
        // expect(directoryListing2).toEqual(expectedEntries2)
    }
    //console.log(JSON.stringify(getDirectoryListing("home", root), null, 2))
    
})