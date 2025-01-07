new Vue({
    el: '#app',
    data: {
        dialogVisible: false,
        targetUrl: '',
        pendingUrl: null,
        isFromIframe: false, 
        milestones: [
            {
                year: '2025',
                title: '持续发展',
                content: '新的目标，新的征程。立足当下，展望未来'
            },
            {
                year: '2024',
                title: '技术突破',
                content: '成功自研MudDB数据库'
            },
            {
                year: '2023',
                title: '快速发展',
                content: '“MudChat”等多个产品横空出世'
            },
            {
                year: '2022',
                title: '团队成立',
                content: '汇聚全国活跃技术分子，开始研发'
            }
        ]
    },
    mounted() {
        // 添加全局点击事件监听
        document.addEventListener('click', this.handleClick, true);
        
        // 监听iframe内的点击事件
        this.$refs.pageIframe.onload = () => {
            try {
                this.$refs.pageIframe.contentWindow.document.addEventListener('click', this.handleClick, true);
            } catch (e) {
                console.warn('无法访问iframe内容，可能是跨域限制');
            }
        }
    },
    methods: {
        handleClick(e) {
            const link = e.target.closest('a');
            if (link && link.href) {
                e.preventDefault();
                
                if (link.hasAttribute('download')) {
                    return;
                }
                
                this.isFromIframe = e.target.ownerDocument !== document;
                this.targetUrl = link.href;
                this.pendingUrl = link.href;
                this.dialogVisible = true;
            }
        },
        
        confirmNavigation() {
            if (this.pendingUrl) {
                // 所有链接都在新标签页打开
                window.open(this.pendingUrl, '_blank');
            }
            this.dialogVisible = false;
            this.pendingUrl = null;
        }
    }
})