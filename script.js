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
    const successCountSpan = document.getElementById('success-count');
    const failCountSpan = document.getElementById('fail-count');
    const statusMessage = document.getElementById('status-message');

    let isRunning = false;
    let abortController = null;

    // --- Database Preset Pesan ---
    const presets = {
        '1': { name: "🏖️ Random Santai", messages: ["spill a secret", "lagi deket sama siapa?", "pap random", "spill chat terakhir", "kangen seseorang ga?", "spill wallpaper", "lagi apa?", "pap ootd", "desc diri sendiri dlm 3 kata", "spill lagu fav", "spill playlist spotify", "kasih saran film", "pap makanan", "lagi pengen apa?", "spill orang yg lagi di pikiranmu", "pap selfie", "hal yg bikin kamu senyum hari ini?", "spill akun ig", "pap sunset/sunrise", "pap pemandangan dari jendelamu", "spill history youtube", "saran tempat nongkrong", "pap meme", "spill chat teraneh", "pap hewan peliharaan", "spill 1 aib", "pap catatan sekolah/kuliah", "spill drakor favorit", "pap salah satu sepatumu", "pap isi tas", "cerita singkat hari ini", "pap langit hari ini", "spill salah satu chat dari dia", "pap snack fav", "spill hobi", "spill mimpi semalem", "pap stiker wa favorit", "pap outfit ke kampus/kantor", "pap koleksi parfum", "spill dungs chat sama aku", "pap makanan terakhir yg kamu makan", "pap sudut kamar fav", "pap buku yg lagi dibaca", "spill game fav", "spill chat sama sahabat", "pap barang kesayangan", "spill chat dari mantan", "pap anything", "pap keyboard hp", "pap lockscreen", "pap homescreen", "lagi overthinking apa?", "spill top 3 emoji", "pap tulisan tanganmu", "lagi ada masalah apa?", "spill aib temenmu", "pap jam tangan"]},
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
        { name: '❓ Tanya Jawab (Default)', value: '' }, { name: '💌 Confessions', value: 'confessions' }, { name: '😈 Never Have I Ever', value: 'neverhave' },
        { name: '📝 3 Words', value: '3words' }, { name: '💯 tbh (to be honest)', value: 'tbh' }, { name: '💞 Ship Me', value: 'shipme' },
        { name: '💔 Dealbreaker', value: 'dealbreaker' }, { name: '😍 Your Crush', value: 'yourcrush' }, { name: '☠️ Cancelled', value: 'cancelled' },
        { name: '🌟 Mode All-Stars (Acak Semua)', value: 'all-stars' }
    ];

    function initUI() {
        gameModeSelect.innerHTML = gameModes.map(mode => `<option value="${mode.value}">${mode.name}</option>`).join('');
        presetChoiceSelect.innerHTML = Object.keys(presets).map(key => `<option value="${key}">${presets[key].name}</option>`).join('');
        messageTypeSelect.addEventListener('change', () => {
            presetGroup.style.display = messageTypeSelect.value === 'preset' ? 'block' : 'none';
            customGroup.style.display = messageTypeSelect.value === 'custom' ? 'block' : 'none';
        });
    }

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const parseDelay = (input) => {
        const parts = input.split('-').map(p => p.trim());
        const parsePart = (part) => {
            const unit = part.slice(-1).toLowerCase();
            let value;
            if (['s', 'm', 'h'].includes(unit)) { value = parseFloat(part.slice(0, -1)); }
            else { value = parseFloat(part); }
            if (isNaN(value)) return null;
            if (unit === 's') return value * 1000;
            if (unit === 'm') return value * 60 * 1000;
            if (unit === 'h') return value * 3600 * 1000;
            return value * 1000;
        };
        const minDelayMs = parsePart(parts[0]);
        const maxDelayMs = parts.length > 1 ? parsePart(parts[1]) : minDelayMs;
        if (minDelayMs === null || maxDelayMs === null || minDelayMs < 0 || maxDelayMs < 0) return { min: 2000, max: 5000 };
        return { min: minDelayMs, max: maxDelayMs };
    };

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startBtn.addEventListener('click', async () => {
        if (isRunning) {
            isRunning = false;
            if (abortController) abortController.abort();
            return;
        }

        const targets = targetsInput.value.split(',').map(u => u.trim()).filter(Boolean);
        if (targets.length === 0) { alert('Username target tidak boleh kosong!'); return; }
        const messageSource = messageTypeSelect.value === 'custom' ? customMessagesInput.value.split('|').map(m => m.trim()).filter(Boolean) : presets[presetChoiceSelect.value]?.messages;
        if (!messageSource || messageSource.length === 0) { alert('Sumber pesan tidak boleh kosong!'); return; }
        const count = countInput.value.toLowerCase() === 'infinity' ? Infinity : parseInt(countInput.value);
        if (isNaN(count) || count <= 0) { alert('Jumlah kirim tidak valid!'); return; }

        isRunning = true;
        abortController = new AbortController();
        startBtn.textContent = '⏹️ Hentikan Proses';
        startBtn.classList.add('running');
        progressCard.style.display = 'block';
        let successCount = 0, failCount = 0;
        successCountSpan.textContent = '0';
        failCountSpan.textContent = '0';
        progressBar.style.width = '0%';
        progressText.textContent = `0 / ${count === Infinity ? '∞' : count}`;
        statusMessage.textContent = 'Memulai proses...';
        
        document.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);

        const shuffledMessages = shuffleArray([...messageSource]);
        const allSlugs = gameModes.map(m => m.value).filter(v => v !== 'all-stars' && v !== '');
        const { min, max } = parseDelay(delayInput.value);

        // --- [PERUBAHAN UTAMA DI SINI] ---
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const nglApiUrl = 'https://ngl.link/api/submit';
        const targetUrl = proxyUrl + nglApiUrl;

        for (let i = 0; i < count; i++) {
            if (!isRunning) break;

            const currentMessage = shuffledMessages[i % shuffledMessages.length];
            const randomUsername = targets[Math.floor(Math.random() * targets.length)];
            let currentGameSlug = gameModeSelect.value;
            if (gameModeSelect.value === 'all-stars') {
                currentGameSlug = allSlugs[Math.floor(Math.random() * allSlugs.length)];
            }
            
            try {
                statusMessage.textContent = `[${i+1}] Mengirim ke @${randomUsername}...`;
                const response = await fetch(targetUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
                    body: `username=${randomUsername}&question=${encodeURIComponent(currentMessage)}&deviceId=${crypto.randomUUID()}&gameSlug=${currentGameSlug}&referrer=`,
                    signal: abortController.signal
                });

                if (response.ok) {
                    successCount++;
                    successCountSpan.textContent = successCount;
                } else {
                    throw new Error(`Proxy merespon dengan status ${response.status}`);
                }

            } catch (error) {
                if (error.name === 'AbortError') break;
                failCount++;
                failCountSpan.textContent = failCount;
                statusMessage.textContent = `Gagal, mencoba lagi... (Detail: ${error.message})`;
                await sleep(5000);
            }

            const progressPercentage = count === Infinity ? 0 : ((successCount + failCount) / count) * 100;
            progressBar.style.width = Math.min(progressPercentage, 100) + '%';
            progressText.textContent = `${successCount + failCount} / ${count === Infinity ? '∞' : count}`;

            const currentDelay = Math.random() * (max - min) + min;
            await sleep(currentDelay);
        }
        
        isRunning = false;
        startBtn.textContent = '🚀 Mulai Kirim';
        startBtn.classList.remove('running');
        statusMessage.textContent = `✅ Selesai! Berhasil: ${successCount}, Gagal: ${failCount}.`;
        document.querySelectorAll('input, select, textarea').forEach(el => el.disabled = false);
    });

    initUI();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(reg => console.log('SW registered.')).catch(err => console.log('SW registration failed: ', err));
    });
}