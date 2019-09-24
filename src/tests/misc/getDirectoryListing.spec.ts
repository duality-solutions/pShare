import { fileListToTree } from "../../shared/system/file/fileListToTree";
import { getDirectoryListing } from "../../shared/system/file/getDirectoryListing";

const testData = [
    "/home/user1/Documents/bandwidths.ods",
    "/home/user1/Documents/benchmarks.ods",
    "/home/user1/Documents/bio",
    "/home/user1/Documents/omg.pdf",
    "/home/user1/Documents/cv.docx",
    "/home/user1/Documents/cv.odt",
    "/home/user1/Documents/cv.pdf",
    "/home/user1/Documents/himem-pod-resources.ods",
    "/home/user1/Documents/invoices/HID-001.odt",
    "/home/user1/Documents/invoices/HID-001.pdf",
    "/home/user1/Documents/invoices/HID-002.odt",
    "/home/user1/Documents/invoices/HID-002.pdf",
    "/home/user1/Documents/invoices/HID-003.odt",
    "/home/user1/Documents/invoices/HID-003.pdf",
    "/home/user1/Documents/invoices/HID-004.odt",
    "/home/user1/Documents/invoices/HID-004.pdf",
    "/home/user1/Documents/invoices/HID-005.odt",
    "/home/user1/Documents/invoices/HID-005.pdf",
    "/home/user1/Documents/invoices/HID-006.odt",
    "/home/user1/Documents/invoices/HID-006.pdf",
    "/home/user1/Documents/invoices/HID-007.odt",
    "/home/user1/Documents/invoices/HID-007.pdf",
    "/home/user1/Documents/invoices/HID-008.odt",
    "/home/user1/Documents/invoices/HID-008.pdf",
    "/home/user1/Documents/invoices/example_invoice.pdf",
    "/home/user1/Documents/invoices/template_for_person.odt",
    "/home/user1/Documents/keys/.foo",
    "/home/user1/Documents/parking.odt",
    "/home/user1/Documents/parking.pdf",
    "/home/user1/Documents/pricings.ods",
    "/home/user1/Documents/pricings2.ods",
    "/home/user1/Documents/pricings2.xlsx",
    "/home/user1/Documents/someData.psh.json",
    "/home/user1/Documents/someData_person1000.psh.json",
    "/home/user1/Documents/someData_person1002.psh.json",
    "/home/user1/Documents/someData_person1003.psh.json",
    "/home/user1/Documents/someData_person1004.psh.json",
    "/home/user1/Documents/someData_person116.psh.json",
    "/home/user1/Documents/someData_person12.psh.json",
    "/home/user1/Documents/rtc_notes",
    "/home/user1/Documents/user1_cv2.odt",
    "/home/user1/Documents/foob",
    "/home/user1/Documents/monkey1.docx",
    "/home/user1/Documents/monkey1.pdf",
    "/home/user1/Documents/timesheet.ods"
];

const expectedEntries = [
    {
        "type": "file",
        "name": "HID-001.odt"
    },
    {
        "type": "file",
        "name": "HID-001.pdf"
    },
    {
        "type": "file",
        "name": "HID-002.odt"
    },
    {
        "type": "file",
        "name": "HID-002.pdf"
    },
    {
        "type": "file",
        "name": "HID-003.odt"
    },
    {
        "type": "file",
        "name": "HID-003.pdf"
    },
    {
        "type": "file",
        "name": "HID-004.odt"
    },
    {
        "type": "file",
        "name": "HID-004.pdf"
    },
    {
        "type": "file",
        "name": "HID-005.odt"
    },
    {
        "type": "file",
        "name": "HID-005.pdf"
    },
    {
        "type": "file",
        "name": "HID-006.odt"
    },
    {
        "type": "file",
        "name": "HID-006.pdf"
    },
    {
        "type": "file",
        "name": "HID-007.odt"
    },
    {
        "type": "file",
        "name": "HID-007.pdf"
    },
    {
        "type": "file",
        "name": "HID-008.odt"
    },
    {
        "type": "file",
        "name": "HID-008.pdf"
    },
    {
        "type": "file",
        "name": "example_invoice.pdf"
    },
    {
        "type": "file",
        "name": "template_for_person.odt"
    }
]

test("getDirectoryListing", () => {
    var root = fileListToTree(testData)
    var directoryListing = getDirectoryListing("/home/user1/Documents/invoices", root)
    expect(directoryListing).toEqual(expectedEntries)
    var directoryListing2 = getDirectoryListing("/home/user1/Documents/invoices/", root)
    expect(directoryListing2).toEqual(expectedEntries)
})