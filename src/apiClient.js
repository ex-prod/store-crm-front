import {writable} from 'svelte/store';

let domain = 'https://dev.mft-prod.ru';
// let domain = 'http://localhost:8080';

export let credentials = writable({
    basicAuthToken: "",
    loggedIn: false
});

let basicAuthToken;

export async function checkLogin(user, password) {
    const s = user + ":" + password;
    const authStr = btoa(s);
    const basicAuthStr = "Basic " + authStr;
    const response = fetch(domain + "/api/units", {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: basicAuthStr
        }
    });

    response.then((result) => {
        console.log(result);
        if (result.status === 200) {
            credentials.update(() => { return {
                basicAuthToken: basicAuthStr,
                loggedIn: true
            }});
            basicAuthToken = basicAuthStr;
            console.log(basicAuthToken);
        } else {
            credentials.update(() => { return {
                basicAuthToken: "",
                loggedIn: false
            }});
            basicAuthToken = "";
        }
    });

    return response;
}

export async function getUnits() {
    return get("/api/units");
}

export async function getVariants(unitId, search) {
    let path = "/api/units/" + unitId + "/variants";
    if (search !== undefined && search !== null && search !== '') {
        path += '?search=' + search;
    }
    return get(path);
}

export async function getOrders(unitId) {
    let path = "/api/units/" + unitId + "/customerorders";
    return get(path);
}

async function get(path) {
    console.log(basicAuthToken);
    const res = fetch(domain + path, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: basicAuthToken
        }
    });

    res.then((result) => {
        if (result.status === 401) {
            credentials.update(() => { return {
                basicAuthToken: "",
                loggedIn: false
            }});
            basicAuthToken = "";
        }
    });

    return (await res).json();
}
