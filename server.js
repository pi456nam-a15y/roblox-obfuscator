const express = require('express');
const cors = require('cors');
const luamin = require('luamin');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/obfuscate', (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: 'ไม่พบโค้ด' });

        let minified = luamin.minify(code);

        let bytes = [];
        for (let i = 0; i < minified.length; i++) {
            bytes.push(minified.charCodeAt(i));
        }

        const obfuscatedCode = `-- Obfuscated by Roblox Lua Obfuscator
local _ = {${bytes.join(',')}}
local __ = ""
for i = 1, #_ do
    __ = __ .. string.char(_[i])
end
local fn, err = loadstring(__)
if fn then
    fn()
else
    warn("Obfuscation execution error: " .. tostring(err))
end`;

        res.json({ result: obfuscatedCode });
    } catch (err) {
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแปลงโค้ด: ' + err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
