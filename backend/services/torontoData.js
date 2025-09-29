// services/torontoData.js
import https from "https";

const packageId = "1a5be46a-4039-48cd-a2d2-8e702abf9516";

// helper to fetch JSON from a URL
function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const chunks = [];
            res.on("data", (c) => chunks.push(c));
            res.on("end", () => {
                try {
                    const json = JSON.parse(Buffer.concat(chunks).toString());
                    resolve(json);
                } catch (e) {
                    reject(e);
                }
            });
            res.on("error", reject);
        });
    });
}

// main function: get drop-ins from the dataset
export async function getTorontoData() {
    // 1. Get package metadata
    const { result } = await fetchJSON(
        `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=${packageId}`
    );

    // 2. Find datastore resources
    const datastoreResources = result.resources.filter((r) => r.datastore_active);

    // 3. Get one of the resources (drop-ins as example)
    const { result: dropResult } = await fetchJSON(
        `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${datastoreResources[0].id}&limit=5000`
    );

    const { result: locationResult } = await fetchJSON(
        `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${datastoreResources[1].id}&limit=5000`
    );

    // 4. Return the records
    return {
        dropResult: dropResult.records,
        locationResult: locationResult.records
    };
}