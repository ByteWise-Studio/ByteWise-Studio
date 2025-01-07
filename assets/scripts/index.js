new Vue({
    el: '#app',
    data: {
        isTop: true,
        isBottom: false, 
        currentPage: 'home',
        dialogVisible: false,
        targetUrl: '',
        pendingUrl: null,
        navItems: [
            { name: '主页', path: 'home' },
            { name: '产品详情', path: 'products' },
            { name: '关于我们', path: 'about' },
            { name: '加入我们', path: 'join' }
        ],
        friendLinks: [
            { name: '百度搜索', url: 'https://www.baidu.com' },
            { name: '谷歌搜索', url: 'https://www.google.com' },
            { name: '必应搜索', url: 'https://www.bing.com' }
        ],
        beianInfo: '© 2024 ByteWise Studio - 京ICP备XXXXXXXX号'
    },
    created() {
        // 监听 localStorage 的变化
        window.addEventListener('storage', this.handleStorageChange);
        
        // 检查是否有待处理的页面跳转
        const pendingPage = localStorage.getItem('pendingPage');
        if (pendingPage) {
            this.currentPage = pendingPage;
            localStorage.removeItem('pendingPage');
        }
    },
    computed: {
        currentPageUrl() {
            return `./pages/${this.currentPage}.html`;
        }
    },
    methods: {
        handleScroll() {
            const mainContent = document.querySelector('.main-content');
            this.isTop = mainContent.scrollTop <= 0;
            const scrollHeight = mainContent.scrollHeight;
            const scrollTop = mainContent.scrollTop;
            const clientHeight = mainContent.clientHeight;
            this.isBottom = scrollHeight - (scrollTop + clientHeight) <= 20;
        },
        changePage(path) {
            this.currentPage = path;
            this.isBottom = false;
            const mainContent = document.querySelector('.main-content');
            mainContent.scrollTop = 0;
        },
        handleIframeLoad(e) {
            try {
                // 设置iframe内容的样式
                const iframeDoc = e.target.contentDocument;
                if (iframeDoc) {
                    iframeDoc.body.style.margin = '0';
                    iframeDoc.body.style.padding = '0';
                    iframeDoc.body.style.overflow = 'visible';
                }
            } catch (err) {
                console.error('Failed to handle iframe load:', err);
            }
        },
        handleStorageChange(e) {
            if (e.key === 'pendingPage' && e.newValue) {
                this.currentPage = e.newValue;
                localStorage.removeItem('pendingPage');
            }
        },
        handleClick(e) {
            // 查找被点击元素最近的链接
            const link = e.target.closest('a');
            if (link && link.href) {
                // 阻止默认行为
                e.preventDefault();
                
                // 排除下载链接
                if (link.hasAttribute('download')) {
                    return;
                }
                
                // 显示确认对话框
                this.targetUrl = link.href;
                this.pendingUrl = link.href;
                this.dialogVisible = true;
            }
        },
        
        confirmNavigation() {
            if (this.pendingUrl) {
                window.location.href = this.pendingUrl;
            }
            this.dialogVisible = false;
            this.pendingUrl = null;
        }
    },
    mounted() {
        const mainContent = document.querySelector('.main-content');
        document.addEventListener('click', this.handleClick, true);
        mainContent.addEventListener('scroll', this.handleScroll);
        this.$nextTick(() => {
            this.handleScroll();
        });
        this.$refs.pageIframe.onload = () => {
            try {
                this.$refs.pageIframe.contentWindow.document.addEventListener('click', this.handleClick, true);
            } catch (e) {
                console.warn('无法访问iframe内容，可能是跨域限制');
            }
        }
    },
    beforeDestroy() {
        const mainContent = document.querySelector('.main-content');
        mainContent.removeEventListener('scroll', this.handleScroll);
    }
});