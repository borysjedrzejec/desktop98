document.addEventListener('alpine:init', () => {
    Alpine.data('councilGame', () => ({
        // Default State
        suspicionLevel: 0,
        budget: -50000000,
        rotX: 0,
        rotY: 0,

        // Desktop icons
        selectedIcon: null,
        desktopIcons: [
            { id: 'mail', name: 'Outlook Express', img: 'ico/mail.ico' },
            { id: 'folder', name: 'Documents', img: 'ico/directory_open_file_mydocs_2k.ico' },
            { id: 'bin', name: 'Bin', img: 'ico/recycle_bin_empty.ico' }
        ],

        clearSelection() {
            this.selectedIcon = null;
        },

        // Desktop windows

        openWindows: [],

        appsData: {
        'mail': {
            title: 'Outlook Express',
            content: 'No new messages.',
            width: 400
        },
        'bin': {
            title: 'Bin',
            content: 'Bin is empty.',
            width: 300
        }
     },

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

        openProgram(appId) {
            // If opened, close.
            if (this.openWindows.find(win => win.id === appId)) {
                this.closeProgram(appId);
                return;
            }

            const appInfo = this.appsData[appId];
            
            if (!appInfo) return; 

            this.openWindows.push({
                id: appId,
                title: appInfo.title,
                content: appInfo.content,
                width: appInfo.width,
                startX: 50 + Math.floor(Math.random() * 50),
                startY: 50 + Math.floor(Math.random() * 50)
            });
        },

        closeProgram(appId) {
            this.openWindows = this.openWindows.filter(win => win.id !== appId);
        }
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

            let newX = e.clientX - this.offsetX;
            let newY = e.clientY - this.offsetY;

            const monitor = document.getElementById('desktop');
            
            const maxX = monitor.clientWidth - this.$el.offsetWidth;
            const maxY = monitor.clientHeight - this.$el.offsetHeight;
            
            this.x = Math.max(0, Math.min(newX, maxX));
            this.y = Math.max(0, Math.min(newY, maxY));
        },
        
        dragEnd() {
            this.isDragging = false;
        }
    }))
})