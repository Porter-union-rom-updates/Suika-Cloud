const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
    config: {
        name: 'grave',
        version: '1.0',
        author: 'Farhan',
        countDown: 10,
        prefix: true,
        groupAdminOnly: false,
        description: 'Generates a Squidward grave meme with your text.',
        category: 'fun',
        guide: {
            en: '{pn}grave <text>'
        },
    },

    onStart: async ({ api, event, args }) => {
        const userText = args.join(' ');

        if (!userText || userText.length < 1) {
            return api.sendMessage("❌ Please provide some text. Example: grave R.I.P. My Motivation", event.threadID);
        }

        const apiUrl = `https://sus-apis-2.onrender.com/api/squidward-grave?text=${encodeURIComponent(userText)}`;

        try {
            api.sendMessage("🪦 Creating grave image, please wait...", event.threadID);

            const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir);
            }
            const imagePath = path.join(cacheDir, `grave_${Date.now()}.png`);
            fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

            api.sendMessage({
                attachment: fs.createReadStream(imagePath)
            }, event.threadID, () => fs.unlinkSync(imagePath));
        } catch (error) {
            console.error("Error generating grave image:", error);
            api.sendMessage("❌ Couldn't generate the grave image right now.", event.threadID);
        }
    }
};
