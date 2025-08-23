const fs = require("fs");
const https = require("https");

const repoOwner = process.env.GITHUB_REPOSITORY
    ? process.env.GITHUB_REPOSITORY.split("/")[0]
    : "ToniXiang";
const apiBase = "api.github.com";

function ghGet(path, token) {
    const options = {
        hostname: apiBase,
        path,
        method: "GET",
        headers: {
            "User-Agent": "github-languages-aggregator",
            Accept: "application/vnd.github.v3+json",
        },
    };
    if (token) options.headers["Authorization"] = `token ${token}`;

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on("error", reject);
        req.end();
    });
}

(async function main() {
    try {
        const token = process.env.GITHUB_TOKEN;
        const user = repoOwner;
        console.log("Fetching repos for", user);
        const repos = await ghGet(`/users/${user}/repos?per_page=100`, token);
        if (!Array.isArray(repos)) {
            console.error("Unexpected repos response", repos);
            process.exit(1);
        }

        const languageTotals = {};
        for (const r of repos) {
            try {
                const langs = await ghGet(`/repos/${user}/${r.name}/languages`, token);
                if (langs && typeof langs === "object") {
                    Object.entries(langs).forEach(([lang, bytes]) => {
                        languageTotals[lang] = (languageTotals[lang] || 0) + (bytes || 0);
                    });
                }
            } catch (e) {
                console.warn("Failed languages for", r.name, e.message || e);
            }
        }

        const outPath = "assets/js/languages.json";
        const meta = {
            generated_at: new Date().toISOString(),
            totals: languageTotals,
            repo_count: repos.length,
        };

        fs.mkdirSync("assets/js", { recursive: true });

        // If an existing file is present, compare the meaningful parts (totals and repo_count)
        let prev = null;
        if (fs.existsSync(outPath)) {
            try {
                prev = JSON.parse(fs.readFileSync(outPath, "utf8"));
            } catch (e) {
                console.warn("Existing languages.json is invalid JSON, will overwrite");
                prev = null;
            }
        }

        function normalizeTotals(t) {
            if (!t) return null;
            const keys = Object.keys(t).sort();
            const o = {};
            for (const k of keys) o[k] = t[k];
            return JSON.stringify(o);
        }

        const prevTotals = prev && prev.totals ? normalizeTotals(prev.totals) : null;
        const newTotals = normalizeTotals(languageTotals);
        const prevCount = prev && typeof prev.repo_count === "number" ? prev.repo_count : null;
        const newCount = repos.length;

        if (prevTotals === newTotals && prevCount === newCount) {
            console.log("No changes in language totals or repo count; skipping write/commit.");
            process.exit(0);
        }

        fs.writeFileSync(outPath, JSON.stringify(meta, null, 2), "utf8");
        console.log("Wrote", outPath);

        // Commit and push only when there are changes
        const child = require("child_process");
        try {
            child.execSync(`git add ${outPath}`, { stdio: "inherit" });
            child.execSync('git commit -m "chore: update languages.json (generated)"', { stdio: "inherit" });
            child.execSync("git push", { stdio: "inherit" });
        } catch (e) {
            // If commit failed (e.g., no changes) just log and continue
            console.warn("Git commit/push step failed or no changes to commit:", e.message || e);
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
