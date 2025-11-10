// src/services/torontoData.ts
import https from "https";
// ---------- Fetch helper ----------
function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, (res) => {
            const chunks = [];
            res.on("data", (c) => chunks.push(c));
            res.on("end", () => {
                try {
                    const json = JSON.parse(Buffer.concat(chunks).toString());
                    resolve(json);
                }
                catch (e) {
                    reject(e);
                }
            });
            res.on("error", reject);
        })
            .on("error", reject);
    });
}
// ---------- Normalizers & coercers ----------
function normalizeKeys(obj) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
        const clean = k.replace(/\s+/g, "").replace(/_/g, "");
        out[clean] = v;
    }
    return out;
}
const toNum = (v) => Number(v);
const toNumOrUndef = (v) => v === undefined || v === null || v === "" ? undefined : Number(v);
const toInt = (v) => Math.trunc(Number(v));
const parseAge = (v) => {
    if (v === "None")
        return "";
    if (typeof v === "string" && v.trim() === "")
        return "";
    const n = Number(v);
    return Number.isFinite(n) ? n : "";
};
// ---------- Type-specific transformers ----------
function transformDropRecords(records) {
    return records.map((raw) => {
        const r = normalizeKeys(raw);
        return {
            id: toInt(r.id),
            LocationID: toInt(r.LocationID),
            CourseID: toInt(r.CourseID),
            CourseTitle: String(r.CourseTitle ?? ""),
            Section: r.Section === undefined ? undefined : String(r.Section),
            AgeMin: parseAge(r.AgeMin),
            AgeMax: parseAge(r.AgeMax),
            FirstDate: String(r.FirstDate ?? ""),
            LastDate: String(r.LastDate ?? ""),
            StartHour: toInt(r.StartHour),
            StartMinute: toInt(r.StartMinute),
            EndHour: toInt(r.EndHour),
            EndMinute: toInt(r.EndMinute),
        };
    });
}
function transformLocationRecords(records) {
    return records.map((raw) => {
        const r = normalizeKeys(raw);
        return {
            LocationID: toInt(r.LocationID),
            LocationName: String(r.LocationName ?? ""),
            LocationType: r.LocationType === undefined ? undefined : String(r.LocationType),
            Accessibility: r.Accessibility === undefined ? undefined : String(r.Accessibility),
            Intersection: r.Intersection === undefined ? undefined : String(r.Intersection),
            TTCInformation: r.TTCInformation === undefined ? undefined : String(r.TTCInformation),
            District: r.District === undefined ? undefined : String(r.District),
            StreetNo: r.StreetNo === undefined ? undefined : String(r.StreetNo),
            StreetNoSuffix: r.StreetNoSuffix === undefined ? undefined : String(r.StreetNoSuffix),
            StreetName: r.StreetName === undefined ? undefined : String(r.StreetName),
            StreetType: r.StreetType === undefined ? undefined : String(r.StreetType),
            StreetDirection: r.StreetDirection === undefined ? undefined : String(r.StreetDirection),
            PostalCode: r.PostalCode === undefined ? undefined : String(r.PostalCode),
            Description: r.Description === undefined ? undefined : String(r.Description),
        };
    });
}
// ---------- Main fetch ----------
const packageId = "1a5be46a-4039-48cd-a2d2-8e702abf9516";
export async function getTorontoData() {
    // 1) package
    const pkg = await fetchJSON(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=${packageId}`);
    const resources = pkg.result.resources.filter((r) => r.datastore_active);
    if (resources.length < 2) {
        throw new Error("Not enough active datastore resources in package.");
    }
    // NOTE: adjust indices if you want to target a specific table reliably
    const dropsRes = await fetchJSON(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${resources[1].id}&limit=5000`);
    const locsRes = await fetchJSON(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${resources[0].id}&limit=5000`);
    return {
        APIdropResults: transformDropRecords(dropsRes.result.records),
        APIlocationResults: transformLocationRecords(locsRes.result.records),
    };
}
