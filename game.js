document.addEventListener('alpine:init', () => {
    Alpine.data('councilGame', () => ({
        // Default State
        isMailOpen: false,
        suspicionLevel: 0,
        budget: -50000000,
        rotX: 0,
        rotY: 0,

        // Taskbar
        isStartOpen: false, 
        currentTime: '00:00',

        // Initialisation
        init() {
            this.updateTime(); 
            
            setInterval(() => {
                this.updateTime();
            }, 1000);
        },

        // Metody
        updateCamera(e) {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            this.rotY = x * 0.1; 
            this.rotX = -y * 0.1;
        },

        get bloomColor() {
            const startCol = { r: 0, g: 128, b: 128 };
            const endCol = { r: 255, g: 0, b: 129 };

            const ratio = this.suspicionLevel / 100;

            const currentR = Math.round(startCol.r + (endCol.r - startCol.r) * ratio);
            const currentG = Math.round(startCol.g + (endCol.g - startCol.g) * ratio);
            const currentB = Math.round(startCol.b + (endCol.b - startCol.b) * ratio);

            // Zwracamy zmienne CSS oraz rotację 3D kamery
            return `
                --bloom-R: ${currentR};
                --bloom-G: ${currentG};
                --bloom-B: ${currentB};
            `;
        },

        processFraud(amount) {
            this.budget += amount;
            this.suspicionLevel = Math.min(100, this.suspicionLevel + (amount / 100000));
        },

        get suspicionBloom() {
            return this.suspicionLevel / 2;
        },

        updateTime() {
            const d = new Date();
            this.currentTime = d.toLocaleTimeString('en-UK', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        },
    }))

    Alpine.data('draggableWindow', (startX = 50, startY = 50) => ({
        x: startX,
        y: startY,
        isDragging: false,
        offsetX: 0,
        offsetY: 0,

        dragStart(e) {
            this.isDragging = true;
            this.offsetX = e.clientX - this.x;
            this.offsetY = e.clientY - this.y;
        },
        
        drag(e) {
            if (!this.isDragging) return;
            
            this.x = e.clientX - this.offsetX;
            this.y = e.clientY - this.offsetY;
        },
        
        dragEnd() {
            this.isDragging = false;
        }
    }))
})