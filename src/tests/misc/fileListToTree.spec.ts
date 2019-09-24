import { fileListToTree } from "../../shared/system/file/fileListToTree";

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

const expectedTree = { "type": "directory", "entries": [{ "name": "/", "type": "directory", "entries": [{ "name": "home/", "type": "directory", "entries": [{ "name": "user1/", "type": "directory", "entries": [{ "name": "Documents/", "type": "directory", "entries": [{ "type": "file", "name": "bandwidths.ods" }, { "type": "file", "name": "benchmarks.ods" }, { "type": "file", "name": "bio" }, { "type": "file", "name": "cv.docx" }, { "type": "file", "name": "cv.odt" }, { "type": "file", "name": "cv.pdf" }, { "type": "file", "name": "foob" }, { "type": "file", "name": "himem-pod-resources.ods" }, { "name": "invoices/", "type": "directory", "entries": [{ "type": "file", "name": "HID-001.odt" }, { "type": "file", "name": "HID-001.pdf" }, { "type": "file", "name": "HID-002.odt" }, { "type": "file", "name": "HID-002.pdf" }, { "type": "file", "name": "HID-003.odt" }, { "type": "file", "name": "HID-003.pdf" }, { "type": "file", "name": "HID-004.odt" }, { "type": "file", "name": "HID-004.pdf" }, { "type": "file", "name": "HID-005.odt" }, { "type": "file", "name": "HID-005.pdf" }, { "type": "file", "name": "HID-006.odt" }, { "type": "file", "name": "HID-006.pdf" }, { "type": "file", "name": "HID-007.odt" }, { "type": "file", "name": "HID-007.pdf" }, { "type": "file", "name": "HID-008.odt" }, { "type": "file", "name": "HID-008.pdf" }, { "type": "file", "name": "example_invoice.pdf" }, { "type": "file", "name": "template_for_person.odt" }] }, { "name": "keys/", "type": "directory", "entries": [{ "type": "file", "name": ".foo" }] }, { "type": "file", "name": "monkey1.docx" }, { "type": "file", "name": "monkey1.pdf" }, { "type": "file", "name": "omg.pdf" }, { "type": "file", "name": "parking.odt" }, { "type": "file", "name": "parking.pdf" }, { "type": "file", "name": "pricings.ods" }, { "type": "file", "name": "pricings2.ods" }, { "type": "file", "name": "pricings2.xlsx" }, { "type": "file", "name": "rtc_notes" }, { "type": "file", "name": "someData.psh.json" }, { "type": "file", "name": "someData_person1000.psh.json" }, { "type": "file", "name": "someData_person1002.psh.json" }, { "type": "file", "name": "someData_person1003.psh.json" }, { "type": "file", "name": "someData_person1004.psh.json" }, { "type": "file", "name": "someData_person116.psh.json" }, { "type": "file", "name": "someData_person12.psh.json" }, { "type": "file", "name": "timesheet.ods" }, { "type": "file", "name": "user1_cv2.odt" }] }] }] }] }] }

test("fileListToTree", () => {
    expect(fileListToTree(testData)).toEqual(expectedTree)
})
