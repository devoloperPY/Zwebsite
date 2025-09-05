document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen HTML ---
    const targetsInput = document.getElementById('targets');
    const gameModeSelect = document.getElementById('gameMode');
    const messageTypeSelect = document.getElementById('messageType');
    const presetGroup = document.getElementById('preset-group');
    const customGroup = document.getElementById('custom-group');
    const presetChoiceSelect = document.getElementById('presetChoice');
    const customMessagesInput = document.getElementById('customMessages');
    const countInput = document.getElementById('count');
    const delayInput = document.getElementById('delay');
    const startBtn = document.getElementById('start-btn');
    const progressCard = document.getElementById('progress-card');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const statusMessage = document.getElementById('status-message');

    let isRunning = false;
    let abortController = null; // Untuk menghentikan fetch requests

    // --- Database Preset Pesan ---
    const presets = {
        '1': { name: "🏖️ Random Santai", messages: ["spill a secret", "lagi deket sama siapa?", "pap random", "spill chat terakhir", "kangen seseorang ga?", "spill wallpaper", "lagi apa?", "pap ootd", "desc diri sendiri dlm 3 kata", "spill lagu fav", "spill playlist spotify", "kasih saran film", "pap makanan", "lagi pengen apa?", "spill orang yg lagi di pikiranmu", "pap selfie", "hal yg bikin kamu senyum hari ini?", "spill akun ig", "pap sunset/sunrise", "pap pemandangan dari jendelamu", "spill history youtube", "saran tempat nongkrong", "pap meme", "spill chat teraneh", "pap hewan peliharaan", "spill 1 aib", "pap catatan sekolah/kuliah", "spill drakor favorit", "pap salah satu sepatumu", "pap isi tas", "cerita singkat hari ini", "pap langit hari ini", "spill salah satu chat dari dia", "pap snack fav", "spill hobi", "spill mimpi semalem", "pap stiker wa favorit", "pap outfit ke kampus/kantor", "pap koleksi parfum", "spill dungs chat sama aku", "pap makanan terakhir yg kamu makan", "pap sudut kamar fav", "pap buku yg lagi dibaca", "spill game fav", "spill chat sama sahabat", "pap barang kesayangan", "spill chat dari mantan", "pap anything", "pap keyboard hp", "pap lockscreen", "pap homescreen"]},
        '2': { name: "🤔 Deep Questions", messages: ["apa penyesalan terbesarmu?", "kapan terakhir kali kamu benar-benar bahagia?", "apa ketakutan terbesarmu?", "satu hal yg ingin kamu ubah dari dirimu?", "apa mimpi terliarmu?", "pelajaran hidup paling berharga?", "definisi 'rumah' menurutmu?", "hal apa yg paling kamu syukuri saat ini?", "kalau bisa kembali ke masa lalu, apa yg akan kamu perbaiki?", "siapa orang yg paling berpengaruh di hidupmu?", "apa arti kesuksesan bagimu?", "apa yg membuatmu merasa hidup?", "apa hal yg paling kamu banggakan dari dirimu?", "bagaimana caramu mengatasi stres?", "apa tujuan hidupmu saat ini?", "apa yg kamu cari dalam sebuah hubungan?", "apa arti 'cinta' untukmu?", "bagaimana kamu mendefinisikan 'kegagalan'?", "apa satu hal yg orang lain salah paham tentangmu?", "kapan kamu merasa paling kesepian?", "apa pencapaian terbesar dalam hidupmu sejauh ini?", "hal apa yg paling kamu rindukan dari masa kecil?", "apa yg akan kamu katakan pada dirimu 5 tahun yg lalu?", "apa yg membuatmu sulit percaya pada orang lain?", "bagaimana caramu menunjukkan kasih sayang?"]},
        '3': { name: "😂 Funny & Absurd", messages: ["kalau jadi hewan, mau jadi apa?", "spill aib paling memalukan", "pilih mana: bisa terbang tapi gabisa mendarat, atau bisa menghilang tapi gabisa muncul lagi?", "apa hal teraneh yg pernah kamu makan?", "ceritakan lelucon bapak-bapak ter-garingmu", "kenapa sabun warnanya macem-macem tapi busanya tetep putih?", "kalau pocong olahraga, favoritnya apa? lari gawang?", "andai kamu jadi hantu, kamu bakal ngapain?", "spill chat teraneh yg pernah kamu dapet", "kalau nyamuk diet, ngisepnya apa? lemak?", "kenapa zombi kalo nyerang barengan? karena kalo sendiri namanya zomblo.", "buah apa yg durhaka? melon kundang."]},
        '4': { name: "🔥 Spicy & Flirty", messages: ["rate aku 1-10", "first impression kamu ke aku?", "hal apa yg bikin kamu salting?", "kirim vn bilang 'i love you'", "kalau kita dinner, mau kemana?", "spill chat terakhir sama doi", "tipe pasangan idamanmu?", "hal apa yg paling kamu suka dari aku?", "boleh ga aku suka sama kamu?", "menurutmu, aku wangi apa?", "kalau aku jadi pacarmu, mau diapain?", "spill fantasi terliarmu", "pap ootd dong", "lebih suka dipeluk atau memeluk?", "apa yg kamu pikirin sebelum tidur?", "pap bibir", "kasih aku 1 pertanyaan privat", "hal tergila apa yg pernah kamu lakuin bareng pasangan?", "apa yg bikin kamu turn on?", "apa yg bikin kamu turn off?"]},
        '5': { name: "🎯 Dare / Tantangan", messages: ["spill chat sama orang terakhir", "ss isi galeri paling bawah", "ss history pencarian google", "pake fotoku di profilmu selama 1 jam", "vn nyanyi lagu yang lagi viral", "kirim pap paling jelek", "update status 'aku sayang [nama owner bot]'", "bilang 'aku kangen kamu' ke kontak ke-3 dari atas", "ss homescreen hp kamu", "vn niruin suara google", "telepon aku sekarang juga", "kirim foto aib temenmu", "confess ke crush kamu sekarang", "vn teriak 'aku jomblo bahagia'"]},
        '6': { name: "❓ Teka-teki", messages: ["aku punya kota, tapi tidak punya rumah. aku punya gunung, tapi tidak punya pohon. aku punya air, tapi tidak punya ikan. siapakah aku?", "hewan apa yg paling kaya? kenapa?", "kalau gajah jadi ayam, lalu singa jadi ayam, dan kambing jadi ayam, maka ayam jadi apa?", "apa yg selalu datang tapi tidak pernah tiba?", "benda apa yg kalau diputar, ia bisa langsung tidur?", "semakin banyak kamu ambil, semakin banyak yg kamu tinggalkan. apakah itu?", "apa yg punya leher tanpa kepala, dan punggung tanpa badan?"]},
        '7': { name: "💬 Quotes & Motivasi", messages: ["jangan berhenti ketika lelah, berhentilah ketika selesai.", "satu-satunya batasan adalah pikiranmu.", "mimpi tidak akan menjadi kenyataan melalui sihir; dibutuhkan keringat, tekad, dan kerja keras.", "percayalah pada dirimu sendiri, bahkan jika tidak ada orang lain yg melakukannya.", "hari ini adalah kesempatan untuk membangun hari esok yg kamu inginkan.", "kegagalan adalah bumbu yg memberi kesuksesan rasa.", "jatuh tujuh kali, bangun delapan kali.", "prosesmu tidak harus dilihat orang lain untuk menjadi valid."]},
        '8': { name: "💘 Gombalan Maut", messages: ["kamu itu kayak google ya? soalnya semua yg aku cari ada di kamu.", "kalo aku jadi wakil rakyat, aku pasti gagal. gimana mau mikirin rakyat, kalo yg ada di pikiranku cuma kamu.", "selain ada pelangi, di matamu juga ada masa depanku.", "cintaku padamu itu seperti utang, awalnya kecil, didiemin, tau-tau gede sendiri.", "kamu tau bedanya kamu sama modem? modem terkoneksi ke internet, kalo kamu terkoneksi ke hatiku.", "aku rela jadi alarm kamu tiap pagi, biar aku yang pertama kali kamu dengerin."]},
        '9': { name: "🌀 Edisi Khusus (Acak Berat)", messages: ["tiba-tiba pengen makan gado-gado", "menurutmu alien itu ada ga?", "coba kirim emoji yg paling menggambarkan suasana hatimu sekarang", "sebutkan 3 hal yg ada di sebelah kananmu sekarang", "kalau waktu bisa berhenti, apa yg akan kamu lakukan?", "spill teori konspirasi paling aneh yg kamu percaya", "pernah ngalamin kejadian horor?", "kalau kamu punya kekuatan super, mau punya kekuatan apa?", "spill aib masa kecilmu", "kirim foto random dari galerimu tanpa liat dulu", "kalau reinkarnasi itu ada, kamu mau jadi apa?", "apa bau yg paling kamu suka?"]}
    };

    const gameModes = [
        { name: '❓ Tanya Jawab (Default)', value: '' },
        { name: '💌 Confessions', value: 'confessions' },
        { name: '😈 Never Have I Ever', value: 'neverhave' },
        { name: '📝 3 Words', value: '3words' },
        { name: '💯 tbh (to be honest)', value: 'tbh' },
        { name: '💞 Ship Me', value: 'shipme' },
        { name: '💔 Dealbreaker', value: 'dealbreaker' },
        { name: '😍 Your Crush', value: 'yourcrush' },
        { name: '☠️ Cancelled', value: 'cancelled' },
        { name: '🌟 Mode All-Stars (Acak Semua)', value: 'all-stars' }
    ];

    // --- Fungsi Bantuan ---
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const parseDelay = (input) => {
        const parts = input.split('-').map(p => p.trim());
        const parsePart = (part) => {
            const unit = part.slice(-1).toLowerCase();
            let value;
            if (['s', 'm', 'h'].includes(unit)) { value = parseFloat(part.slice(0, -1)); } 
            else { value = parseFloat(part); } // Default to seconds if no unit
            if (isNaN(value) || value < 0) return null;
            if (unit === 's') return value * 1000;
            if (unit === 'm') return value * 60 * 1000;
            if (unit === 'h') return value * 3600 * 1000;
            return value * 1000; // Default to seconds if no unit
        };

        const minDelayMs = parsePart(parts[0]);
        const maxDelayMs = parts.length > 1 ? parsePart(parts[1]) : minDelayMs;
        
        // Default to 2-5 seconds if parsing fails or invalid
        if (minDelayMs === null || maxDelayMs === null || minDelayMs < 0 || maxDelayMs < 0) {
            return { min: 2000, max: 5000 };
        }
        return { min: minDelayMs, max: maxDelayMs };
    };

    // --- Inisialisasi UI ---
    function initUI() {
        // Isi Game Modes
        gameModeSelect.innerHTML = gameModes.map(mode => `<option value="${mode.value}">${mode.name}</option>`).join('');

        // Isi Preset Messages
        presetChoiceSelect.innerHTML = Object.keys(presets).map(key => 
            `<option value="${key}">${presets[key].name}</option>`
        ).join('');

        // Tampilkan/sembunyikan grup pesan custom/preset
        messageTypeSelect.addEventListener('change', () => {
            if (messageTypeSelect.value === 'preset') {
                presetGroup.style.display = 'block';
                customGroup.style.display = 'none';
            } else {
                presetGroup.style.display = 'none';
                customGroup.style.display = 'block';
            }
        });

        // Set default values if empty
        if (!targetsInput.value) targetsInput.value = ''; // Example: default target
        if (!countInput.value) countInput.value = '100';
        if (!delayInput.value) delayInput.value = '3-7s';
    }

    // --- Fungsi Utama Pengiriman ---
    startBtn.addEventListener('click', async () => {
        if (!isRunning) { // Mulai Proses
            const targets = targetsInput.value.split(',').map(u => u.trim()).filter(Boolean);
            if (targets.length === 0) {
                alert('Username target tidak boleh kosong!');
                return;
            }

            const messageSource = messageTypeSelect.value === 'custom'
                ? customMessagesInput.value.split('|').map(m => m.trim()).filter(Boolean)
                : presets[presetChoiceSelect.value]?.messages;

            if (!messageSource || messageSource.length === 0) {
                alert('Sumber pesan tidak boleh kosong!');
                return;
            }

            const count = countInput.value.toLowerCase() === 'infinity' ? Infinity : parseInt(countInput.value);
            if (isNaN(count) || count <= 0) {
                alert('Jumlah kirim tidak valid (harus angka positif atau "infinity")!');
                return;
            }

            // Aktifkan mode berjalan
            isRunning = true;
            startBtn.textContent = '⏹️ Hentikan Proses';
            startBtn.classList.add('running'); // Tambahkan class untuk styling tombol stop
            progressCard.style.display = 'block';
            progressBar.style.width = '0%';
            progressText.textContent = `0 / ${count === Infinity ? '∞' : count} terkirim`;
            statusMessage.textContent = 'Memulai pengiriman...';
            
            // Nonaktifkan input selama proses berjalan
            targetsInput.disabled = true;
            gameModeSelect.disabled = true;
            messageTypeSelect.disabled = true;
            presetChoiceSelect.disabled = true;
            customMessagesInput.disabled = true;
            countInput.disabled = true;
            delayInput.disabled = true;

            let successCount = 0;
            const shuffledMessages = [...messageSource].sort(() => Math.random() - 0.5);
            const allSlugs = gameModes.map(m => m.value).filter(v => v !== 'all-stars'); // Semua game mode kecuali all-stars itu sendiri
            const { min, max } = parseDelay(delayInput.value);

            abortController = new AbortController(); // Inisialisasi AbortController

            for (let i = 0; i < count; i++) {
                if (!isRunning) break; // Berhenti jika isRunning false (tombol dihentikan)

                try {
                    const currentMessage = shuffledMessages[i % shuffledMessages.length];
                    const randomUsername = targets[Math.floor(Math.random() * targets.length)];
                    
                    let currentGameSlug = gameModeSelect.value;
                    if (gameModeSelect.value === 'all-stars') {
                        currentGameSlug = allSlugs[Math.floor(Math.random() * allSlugs.length)];
                    }
                    
                    const url = "https://ngl.link/api/submit";
                    // Gunakan crypto.randomUUID() untuk deviceId agar unik di browser
                    const deviceId = crypto.randomUUID(); 
                    const body = `username=${randomUsername}&question=${encodeURIComponent(currentMessage)}&deviceId=${deviceId}&gameSlug=${currentGameSlug}&referrer=`;
                    
                    statusMessage.textContent = `Mengirim ke @${randomUsername} (${gameModes.find(m => m.value === currentGameSlug)?.name || 'Default'})...`;

                    await fetch(url, { 
                        method: 'POST', 
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
                        body: body,
                        signal: abortController.signal // Hubungkan signal ke fetch
                    });
                    
                    successCount++;
                    const progressPercentage = count === Infinity ? 0 : (successCount / count) * 100;
                    progressBar.style.width = Math.min(progressPercentage, 100) + '%';
                    progressText.textContent = `${successCount} / ${count === Infinity ? '∞' : count} terkirim`;

                    const currentDelay = Math.random() * (max - min) + min;
                    await sleep(currentDelay);

                } catch (error) {
                    if (error.name === 'AbortError') {
                        statusMessage.textContent = 'Proses dihentikan.';
                        break;
                    }
                    console.error('Error pengiriman:', error);
                    statusMessage.textContent = `Error, mencoba lagi... (Detail: ${error.message || 'Unknown Error'})`;
                    await sleep(15000); // Tunggu lebih lama jika ada error
                    i--; // Ulangi iterasi yang gagal
                }
            }
            // Proses selesai atau dihentikan
            statusMessage.textContent = `✅ Selesai! Total ${successCount} pesan berhasil dikirim.`;
            progressBar.style.width = '100%'; // Pastikan bar penuh di akhir
            progressBar.style.backgroundColor = 'var(--green-success)';
            startBtn.textContent = '🚀 Mulai Kirim';
            startBtn.classList.remove('running');
            isRunning = false;

            // Aktifkan kembali input
            targetsInput.disabled = false;
            gameModeSelect.disabled = false;
            messageTypeSelect.disabled = false;
            presetChoiceSelect.disabled = false;
            customMessagesInput.disabled = false;
            countInput.disabled = false;
            delayInput.disabled = false;

        } else { // Menghentikan Proses
            isRunning = false;
            if (abortController) {
                abortController.abort(); // Batalkan semua fetch request yang sedang berjalan
            }
            startBtn.textContent = '🚀 Mulai Kirim';
            startBtn.classList.remove('running');
            statusMessage.textContent = 'Proses dihentikan oleh pengguna.';
            // progressCard.style.display = 'none'; // Sembunyikan jika ingin
        }
    });

    initUI(); // Panggil inisialisasi UI saat DOM siap
});

// --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered: ', registration);
            })
            .catch(registrationError => {
                console.log('ServiceWorker registration failed: ', registrationError);
            });
    });
}