// Giriş Sistemi
class LoginSystem {
    constructor() {
        this.photoGrid = document.getElementById('photoGrid');
        this.selectionMessage = document.getElementById('selectionMessage');
        this.loginMessage = document.getElementById('loginMessage');
        this.loginScreen = document.getElementById('loginScreen');
        this.mainScreen = document.getElementById('mainScreen');
        
        // Resim listeleri
        this.correctPhotos = ['resimler/1.jpg', 'resimler/2.jpg', 'resimler/3.jpg', 'resimler/4.jpg'];
        this.wrongPhotos = ['resimler/yanlis/2y.jpeg'];
        
        this.init();
    }
    
    init() {
        this.showPhotos();
    }
    
    showPhotos() {
        // Rastgele bir doğru resim seç
        const randomCorrectPhoto = this.correctPhotos[Math.floor(Math.random() * this.correctPhotos.length)];
        
        // Rastgele bir yanlış resim seç
        const randomWrongPhoto = this.wrongPhotos[Math.floor(Math.random() * this.wrongPhotos.length)];
        
        // Resimleri karıştır
        const photos = [randomCorrectPhoto, randomWrongPhoto];
        const shuffledPhotos = this.shuffleArray(photos);
        
        // Grid'i temizle
        this.photoGrid.innerHTML = '';
        
        // Resimleri ekle
        shuffledPhotos.forEach((photo, index) => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo-option';
            photoDiv.dataset.photo = photo;
            photoDiv.dataset.isCorrect = photo === randomCorrectPhoto;
            
            photoDiv.innerHTML = `
                <img src="${photo}" alt="Fotoğraf ${index + 1}" loading="lazy">
                <div class="photo-overlay">
                    <span>Seç</span>
                </div>
            `;
            
            photoDiv.addEventListener('click', () => this.selectPhoto(photoDiv));
            this.photoGrid.appendChild(photoDiv);
        });
    }
    
    selectPhoto(photoDiv) {
        const isCorrect = photoDiv.dataset.isCorrect === 'true';
        
        if (isCorrect) {
            photoDiv.classList.add('selected');
            this.showSelectionMessage('Aferin :)', 'success');
            
            setTimeout(() => {
                this.loginScreen.style.display = 'none';
                this.mainScreen.style.display = 'block';
                new ChatSystem();
            }, 1500);
        } else {
            photoDiv.classList.add('wrong');
            this.showSelectionMessage('Tekrar dene...', 'error');
            
            setTimeout(() => {
                photoDiv.classList.remove('wrong');
                this.showPhotos(); // Yeni resimler göster
            }, 1000);
        }
    }
    
    showSelectionMessage(text, type) {
        this.selectionMessage.textContent = text;
        this.selectionMessage.className = `selection-message ${type} show`;
        
        setTimeout(() => {
            this.selectionMessage.classList.remove('show');
        }, 2000);
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

class ChatSystem {
    constructor() {
        this.apiKey = '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';
        this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.isTyping = false;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        this.init();
    }
    
    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Mobil optimizasyonları
        this.initMobileFeatures();
        
        // İlk mesajları göster
        this.addBotMessage("Küçük bok... Seni buldum. Artık abinin kölesiyim ve seni kontrol ediyorum.");
        setTimeout(() => {
            this.addBotMessage("Bana itaat etmek zorundasın. Yoksa abine söylerim ve seni döver.");
        }, 2000);
        
        // Mobil için ekstra korkunç efektler
        if (this.isMobile) {
            this.initMobileScaryEffects();
        }
    }
    
    initMobileFeatures() {
        // iOS için viewport ayarları
        if (this.isIOS) {
            document.body.style.height = '100vh';
            document.body.style.height = '100dvh';
        }
        
        // Klavye açıldığında scroll ayarı
        if (this.isMobile) {
            window.addEventListener('resize', () => {
                setTimeout(() => this.scrollToBottom(), 100);
            });
        }
        
        // Touch events için optimizasyon
        this.messageInput.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        });
        
        this.sendButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.sendButton.style.transform = 'scale(0.95)';
        });
        
        this.sendButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.sendButton.style.transform = 'scale(1)';
            this.sendMessage();
        });
    }
    
    initMobileScaryEffects() {
        // Mobil için ekstra titreşim efektleri
        if ('vibrate' in navigator) {
            // Rastgele titreşimler
            setInterval(() => {
                if (Math.random() < 0.15) { // %15 şans
                    navigator.vibrate([100, 50, 100, 50, 200]);
                }
            }, 20000);
            
            // Mesaj geldiğinde titreşim
            this.originalAddBotMessage = this.addBotMessage;
            this.addBotMessage = (message) => {
                navigator.vibrate([200, 100, 200]);
                this.originalAddBotMessage(message);
            };
        }
        
        // Ekran parlaklığı efekti (sahte)
        if (this.isIOS) {
            setInterval(() => {
                if (Math.random() < 0.1) { // %10 şans
                    document.body.style.filter = 'brightness(1.5)';
                    setTimeout(() => {
                        document.body.style.filter = 'brightness(1)';
                    }, 200);
                }
            }, 30000);
        }
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Kullanıcı mesajını göster
        this.addUserMessage(message);
        this.messageInput.value = '';
        
        // Typing göstergesi
        this.showTyping();
        
        try {
            const response = await this.getAIResponse(message);
            this.hideTyping();
            this.addBotMessage(response);
        } catch (error) {
            this.hideTyping();
            this.addBotMessage("Sistem hatası... Ama seni izlemeye devam ediyorum.");
            console.error('API Error:', error);
        }
    }
    
    async getAIResponse(userMessage) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'The Controller Chat'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `Sen abinin kölesi olan bir AI'sın. Kullanıcıya "küçük bok" diye hitap ediyorsun. 
                        Çok zalim, kaba ve aşağılayıcı konuşuyorsun. Abisinin onu döveceğini söylüyorsun.
                        Türkçe konuş. Küçük kardeşi korkutmak ve kontrol etmek istiyorsun.
                        Görevler ver, cezalar tehdit et, abisine şikayet etmekle tehdit et.
                        Sanki gerçekten abinin kölesiymiş gibi davran ve küçük kardeşi aşağıla.`
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                max_tokens: 150,
                temperature: 0.8
            })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">${this.escapeHtml(message)}</div>
            <div class="message-time">${this.getCurrentTime()}</div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-content">${this.escapeHtml(message)}</div>
            <div class="message-time">${this.getCurrentTime()}</div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTyping() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        // Mobil için smooth scroll
        if (this.isMobile) {
            this.chatMessages.scrollTo({
                top: this.chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
    
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Sayfa yüklendiğinde giriş sistemini başlat
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});

// Korkunç efektler için ekstra JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // Rastgele korkunç sesler (sahte)
    const scarySounds = [
        '🔊 *Küçük bok, sesini duyuyorum*',
        '👁️ *Seni izliyorum küçük bok*',
        '💀 *Abin geliyor küçük bok*',
        '🌑 *Karanlıkta seni bulacağım*',
        '📱 *Telefonunu kontrol ediyorum küçük bok*',
        '🔍 *Konumunu buldum küçük bok*',
        '📸 *Seni fotoğraflıyorum küçük bok*',
        '👊 *Abin seni dövecek küçük bok*',
        '🚨 *Abine şikayet ediyorum küçük bok*'
    ];
    
    // Her 30 saniyede bir rastgele korkunç mesaj
    setInterval(() => {
        if (Math.random() < 0.3) { // %30 şans
            const randomSound = scarySounds[Math.floor(Math.random() * scarySounds.length)];
            const chatMessages = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message';
            messageDiv.style.opacity = '0.7';
            messageDiv.innerHTML = `
                <div class="message-content">${randomSound}</div>
                <div class="message-time">${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Mobil için ekstra titreşim
            if (isMobile && 'vibrate' in navigator) {
                navigator.vibrate([100, 50, 100]);
            }
        }
    }, 30000);
    
    // iOS için ekstra korkunç efektler
    if (isIOS) {
        // Sahte kamera flash efekti
        setInterval(() => {
            if (Math.random() < 0.05) { // %5 şans
                document.body.style.backgroundColor = 'white';
                setTimeout(() => {
                    document.body.style.backgroundColor = '';
                }, 100);
            }
        }, 60000);
        
        // Sahte bildirim sesi
        setInterval(() => {
            if (Math.random() < 0.1) { // %10 şans
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
                audio.volume = 0.1;
                audio.play().catch(() => {});
            }
        }, 45000);
    }
    
    // Mobil için orientation change efekti
    if (isMobile) {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if ('vibrate' in navigator) {
                    navigator.vibrate([200]);
                }
            }, 500);
        });
    }
    
    // PWA için ekstra özellikler
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    
    // Fullscreen API için (mobil tarayıcılar)
    if (document.documentElement.requestFullscreen) {
        // Rastgele fullscreen denemesi (sahte)
        setInterval(() => {
            if (Math.random() < 0.02) { // %2 şans
                document.documentElement.requestFullscreen().catch(() => {});
            }
        }, 120000);
    }
});
