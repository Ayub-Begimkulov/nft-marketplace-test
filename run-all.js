const { exec, spawn } = require("child_process");

let processes = [];
let retries = 0;
const maxRetries = 2;

async function startNgrok() {
    console.log("Starting ngrok...");
    const ngrokProcess = spawn("ngrok", ["http", "5173"], { stdio: "ignore" });
    processes.push(ngrokProcess);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        const response = await fetch("http://127.0.0.1:4040/api/tunnels");
        const data = await response.json();
        if (data.tunnels.length === 0) {
            throw new Error("No tunnels found");
        }
        return data.tunnels[data.tunnels.length - 1].public_url;
    } catch (error) {
        console.error("Failed to retrieve ngrok URL:", error.message);
        if (retries < maxRetries) {
            retries++;
            console.log("Retrying...");
            return startNgrok();
        } else {
            process.exit(1);
        }
    }
}

function runCommand(command, cwd, name) {
    console.log(`Running: ${command} in ${cwd}`);
    const child = exec(command, { cwd });

    processes.push(child);

    child.stdout.on("data", (data) => console.log(`[${name}] ${data}`));
    child.stderr.on("data", (data) => console.error(`[${name} ERROR] ${data}`));
}

async function main() {
    const ngrokUrl = await startNgrok();
    console.log(`Ngrok URL: ${ngrokUrl}`);

    runCommand("npm run dev", "./front", "front");

    runCommand("docker-compose up -d", "./back", "docker");

    runCommand(`TG_WEB_APP_URL=${ngrokUrl} npm run dev`, "./back", "back");

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
}

function cleanup() {
    console.log("\nStopping all processes...");
    processes.forEach((proc) => proc.kill && proc.kill());
    process.exit(0);
}

main();
