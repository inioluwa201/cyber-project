document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quoteForm');
    const logConsole = document.getElementById('logConsole');

    const databaseLog = [];

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const companyName = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const timestamp = new Date().toLocaleTimeString();

        // 1. SIGNATURE PROTECTION: SQL Injection Rule
        const sqlInjectionPattern = /['"\\#]|(--)|(OR\s+['"]?\d+['"]?\s*=\s*['"]?\d+)/i;

        // 2. SIGNATURE PROTECTION: Cross-Site Scripting (XSS) Rule
        // This looks for opening tags <script>, HTML characters, or event handlers like onerror/onload
        const xssPattern = /<script\b[^>]*>([\s\S]*?)<\/script>|(<[^>]+>)|(on\w+\s*=)/i;

        // check for SQL Injection
        if (sqlInjectionPattern.test(companyName) || sqlInjectionPattern.test(email)) {
            const attackRecord = `> [${timestamp}] 🛑 ALARM: SQL Injection payload blocked from: ${email}`;
            databaseLog.push({ type: 'THREAT', details: attackRecord });
            logConsole.innerHTML += `<div class="log-entry threat">${attackRecord}</div>`;
            alert("🚨 SECURITY MONITOR: SQL Injection intercepted.");
            form.reset();
            return;
        }

        // check for XSS (Cross-Site Scripting)
        if (xssPattern.test(companyName) || xssPattern.test(email)) {
            const attackRecord = `> [${timestamp}] ☢️ ALARM: XSS Code Injection blocked in fields! Threat neutralized.`;
            databaseLog.push({ type: 'THREAT', details: attackRecord });
            logConsole.innerHTML += `<div class="log-entry threat">${attackRecord}</div>`;
            logConsole.scrollTop = logConsole.scrollHeight;
            
            alert("🚨 ADVANCED THREAT DEFENSE: Cross-Site Scripting (XSS) code detected and discarded.");
            form.reset();
            return;
        }

        // Clean entry passes
        const cleanRecord = `> [${timestamp}] 🟩 SUCCESS: Safe connection verified from: "${companyName}"`;
        databaseLog.push({ type: 'CLEAN', details: cleanRecord });
        logConsole.innerHTML += `<div class="log-entry success">${cleanRecord}</div>`;
        logConsole.scrollTop = logConsole.scrollHeight;

        alert(`Data validation complete. Safe token stored.`);
        form.reset();
    });
});
