new Vue({
    el: '#app',
    data: {
        dialogVisible: false,
        targetUrl: '',
        pendingUrl: null,
        isFromIframe: false, 
                // 新增申请表单相关数据
                applyDialogVisible: false,
                selectedJob: null,
                applyForm: {
                    name: '',
                    age: '',
                    educationLevel: '',
                    grade: '',
                    province: '',
                    city: '',
                    email: ''
                },
                educationOptions: ['小学', '初中'],
                gradeOptions: {
                    '小学': ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
                    '初中': ['一年级', '二年级', '三年级']
                },
        benefits: [
            {
                icon: 'el-icon-medal',
                title: '领先同行',
                description: '遥遥领先，无限进步'
            },
            {
                icon: 'el-icon-coffee-cup',
                title: '弹性工作',
                description: '弹性工作，随时随地'
            },
            {
                icon: 'el-icon-reading',
                title: '持续学习',
                description: '共同学习，共同进步'
            },
            {
                icon: 'el-icon-first-aid-kit',
                title: '福利完善',
                description:'有功必赏，有答必谢'
            }
        ],
        jobs: [
            {
                id: 1,
                title: '前端开发工程师 1人',
                department: 'Web Development Engineer',
                location: '1 person',
                description: '会较为熟练运用HTML CSS JS等，熟悉Vue框架，有项目经验者优先。'
            },
            {
                id: 2,
                title: 'Python后端开发工程师 1人',
                department: 'Python Backend Development Engineer',
                location: '1 person',
                description: '熟悉Python，熟悉Django/Flask框架，有项目经验者优先。'
            },
            {
                id: 3,
                title: 'C/C++后端开发工程师 1人',
                department: 'C/C++ Backend Development Engineer',
                location: '1 person',
                description: '熟悉C/C++，熟悉GTK/QT，有项目经验者优先。'
            },
            {
                id: 4,
                title: 'C/C++算法开发工程师 1-2人',
                department: 'C/C++ Algorithm Development Engineer',
                location: '1-2 person',
                description: '熟悉C/C++，熟悉算法，有项目经验者优先。'
            },
            {
                id: 5,
                title: '美工 1人',
                department: 'UI Designer',
                location: '1 person',
                description: '会运用作图软件作出简介轻拟物的图标、UI元素设计稿等，有项目经验者优先。'
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
        },
        handleApply(job) {
            this.selectedJob = job;
            this.applyDialogVisible = true;
        },

        submitApplication() {
            // 表单验证
            if (!this.applyForm.name) {
                this.$message.error('请填写姓名');
                return;
            }
            if (!this.applyForm.age) {
                this.$message.error('请填写年龄');
                return;
            }
            if (!this.applyForm.educationLevel) {
                this.$message.error('请选择学习阶段');
                return;
            }
            if (!this.applyForm.grade) {
                this.$message.error('请选择年级');
                return;
            }
            if (!this.applyForm.province || !this.applyForm.city) {
                this.$message.error('请填写完整的居住地信息');
                return;
            }
            if (!this.applyForm.email) {
                this.$message.error('请填写电子邮件');
                return;
            }

            // 验证邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.applyForm.email)) {
                this.$message.error('请输入有效的电子邮件地址');
                return;
            }

            // 构建邮件内容
            const mailtoLink = `mailto:ByteWise_Join@outlook.com?subject=应聘${this.selectedJob.title}&body=职位信息：
${this.selectedJob.title}
${this.selectedJob.description}

申请人信息：
姓名：${this.applyForm.name}
年龄：${this.applyForm.age}
学习阶段：${this.applyForm.educationLevel}${this.applyForm.grade}
居住地：${this.applyForm.province}${this.applyForm.city}
联系邮箱：${this.applyForm.email}`;

            window.location.href = encodeURI(mailtoLink);
            this.applyDialogVisible = false;
            this.$message.success('请使用电子邮件程序继续~');
            
            // 重置表单
            this.applyForm = {
                name: '',
                age: '',
                educationLevel: '',
                grade: '',
                province: '',
                city: '',
                email: ''
            };
        }
    }
})