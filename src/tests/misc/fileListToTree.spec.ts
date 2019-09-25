import { fileListToTree } from "../../shared/system/file/fileListToTree";
import { SharedFile } from "../../shared/types/SharedFile";

const testData = [
    "home/user1/Documents/bandwidths.ods",
    "home/user1/Documents/invoices/HID-001.odt",
];

const mappedTestData: SharedFile[] = testData.map<SharedFile>(path => ({
    sharedWith: "string",
    relativePath: path,
    path,
    size: 123,
    contentType: "string",
    direction: "out"
}))

const expectedTree = {
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
      }
    ]
  }

test("fileListToTree", () => {
    const result = fileListToTree<SharedFile>(mappedTestData);
    expect(result).toEqual(expectedTree)
})
