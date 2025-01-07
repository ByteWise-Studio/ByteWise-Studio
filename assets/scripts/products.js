new Vue({
    el: '#app',
    data: {
        activeTab: 'ai',
        productDialogVisible: false,
        downloadDialogVisible: false,
        navigationDialogVisible: false,
        selectedProduct: {},
        targetUrl: '',
        pendingUrl: null,
        isFromIframe: false,
        categories: [
            {
                name: 'ai',
                label: 'AI产品',
                products: [
                    {
                        id: 1,
                        name: 'AI助手',
                        description: '智能对话，高效协作',
                        image: 'https://via.placeholder.com/300x200',
                        detailImage: 'https://via.placeholder.com/800x400',
                        detailDescription: `
                            <h3>产品特点</h3>
                            <ul>
                                <li>智能对话系统</li>
                                <li>多场景应用</li>
                                <li>快速响应</li>
                            </ul>
                            <h3>技术规格</h3>
                            <p>支持多种编程语言，API接口丰富，部署便捷。</p>
                        `,
                        downloadable: true,
                        downloads: [
                            {
                                name: 'Windows版本',
                                url: 'https://example.com/download/windows'
                            },
                            {
                                name: 'Mac版本',
                                url: 'https://example.com/download/mac'
                            }
                        ]
                    },
                ]
            }
        ]
    },
    methods: {
        showProductDetail(product) {
            this.selectedProduct = product;
            this.productDialogVisible = true;
        },
        handleClose(done) {
            done();
        },
        showDownloadDialog(product) {
            if (product) {
                this.selectedProduct = product;
            }
            this.downloadDialogVisible = true;
        },
        handleDownload(url) {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            
            this.$message({
                message: '开始下载...',
                type: 'success'
            });

            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 2000);
        },
        handleLinkClick(e) {
            this.targetUrl = e.target.href;
            this.pendingUrl = e.target.href;
            this.navigationDialogVisible = true;
        },
        confirmNavigation() {
            if (this.pendingUrl) {
                window.open(this.pendingUrl, '_blank');
            }
            this.navigationDialogVisible = false;
            this.pendingUrl = null;
        }
    }
});