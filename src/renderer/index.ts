import { indexRenderer } from "./indexRenderer";
import { indexRtc } from "./indexRtc";

function getQueryVariable(variable: string) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    throw Error(`Query variable ${variable} not found`);
}



const role = getQueryVariable("role")

switch (role) {
    case "renderer":
        indexRenderer()
        break
    case "rtc":
        indexRtc()
        break;
    default:
        throw Error("unknown role")
}