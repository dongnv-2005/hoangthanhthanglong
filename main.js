document.addEventListener('DOMContentLoaded', () => {
    const btnSpeak = document.getElementById('btn-speak');
    const btnStop = document.getElementById('btn-stop');
    const textContainer = document.getElementById('text-to-read');
    const synth = window.speechSynthesis;

    // 1. Hàm lấy danh sách giọng nói
    const getVoices = () => {
        return new Promise((resolve) => {
            let voices = synth.getVoices();
            if (voices.length !== 0) {
                resolve(voices);
            } else {
                synth.onvoiceschanged = () => {
                    voices = synth.getVoices();
                    resolve(voices);
                };
            }
        });
    };

    // 2. Hàm xử lý đọc
    async function speak() {
        if (!textContainer) return;
        
        synth.cancel();

        const voices = await getVoices();
        const text = textContainer.innerText.trim();
        const utterance = new SpeechSynthesisUtterance(text);

        const viVoice = voices.find(v => v.lang.toLowerCase().includes('vi'));

        if (viVoice) {
            utterance.voice = viVoice;
            utterance.lang = 'vi-VN';
            console.log("✅ Đang sử dụng giọng:", viVoice.name);
        } else {
            utterance.lang = 'vi-VN';
            alert("Cảnh báo: Máy tính của bạn thiếu gói 'Giọng đọc tiếng Việt'. Trình duyệt sẽ cố đọc bằng giọng mặc định.");
        }

        utterance.rate = 1.2; 
        utterance.pitch = 1.2;

        // Xử lý giao diện nút bấm
        utterance.onstart = () => {
            btnSpeak.style.display = 'none';
            btnStop.style.display = 'inline-block';
        };
        utterance.onend = () => {
            btnSpeak.style.display = 'inline-block';
            btnStop.style.display = 'none';
        };
        utterance.onerror = () => {
            btnSpeak.style.display = 'inline-block';
            btnStop.style.display = 'none';
        };

        synth.speak(utterance);
    }

    // 3. Gán sự kiện cho nút bấm
    if (btnSpeak) btnSpeak.onclick = speak;
    
    if (btnStop) {
        btnStop.onclick = () => {
            synth.cancel();
            btnSpeak.style.display = 'inline-block';
            btnStop.style.display = 'none';
        };
    }
});