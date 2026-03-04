const fs = require('fs');
async function run() {
    try {
        const res = await fetch("https://blogiq-theta.vercel.app/api/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ blogId: "demo-ip-test" })
        });
        const text = await res.text();
        fs.writeFileSync('error_output.txt', text);
        console.log("Written to error_output.txt");
    } catch (e) {
        console.error(e);
    }
}
run();
