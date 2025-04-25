/**
 * 可靠的自定义变量管理器
 */
var CustomVariableManager = (function() {
    var workspace;
    var dialog = null;
    
    function createDialog() {
        // 创建对话框DOM
        var overlay = document.createElement('div');
        overlay.className = 'variable-dialog-overlay';
        
        overlay.innerHTML = `
            <div class="variable-dialog">
                <h3>创建新变量</h3>
                <div class="variable-dialog-content">
                    <label class="variable-dialog-label">变量名称:</label>
                    <input type="text" class="variable-dialog-input" placeholder="输入变量名">
                </div>
                <div class="variable-dialog-actions">
                    <button class="variable-dialog-button cancel">取消</button>
                    <button class="variable-dialog-button create">创建</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        return overlay;
    }
    
    return {
        init: function(ws) {
            workspace = ws;
            dialog = createDialog();
            this.bindEvents();
        },
        
        bindEvents: function() {
            // 绑定按钮回调
            workspace.registerButtonCallback(
                'CUSTOM_CREATE_VARIABLE',
                this.showDialog.bind(this)
            );
            
            // 绑定对话框事件
            dialog.querySelector('.cancel').addEventListener('click', this.hideDialog.bind(this));
            dialog.querySelector('.create').addEventListener('click', this.onCreateClick.bind(this));
            dialog.querySelector('.variable-dialog-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.onCreateClick();
            });
        },
        
        showDialog: function() {
            var dialogContent = dialog.querySelector('.variable-dialog');
            dialog.classList.add('active');
            
            // 设置初始状态
            dialogContent.style.transition = 'none';
            dialogContent.style.opacity = '0';
            dialogContent.style.transform = 'scale(0.5)';
            
            // 强制重绘
            void dialogContent.offsetWidth;
            
            // 启用动画
            dialogContent.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            dialogContent.style.opacity = '1';
            dialogContent.style.transform = 'scale(1)';
            
            dialog.querySelector('.variable-dialog-input').focus();
        },
        
        hideDialog: function() {
            var dialogContent = dialog.querySelector('.variable-dialog');
            dialogContent.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            dialogContent.style.opacity = '0';
            dialogContent.style.transform = 'scale(0.5)';
            
            setTimeout(() => {
                dialog.classList.remove('active');
                dialogContent.style.opacity = '1';
                dialogContent.style.transform = 'scale(1)';
            }, 500);
        },
        
        onCreateClick: function() {
            const input = dialog.querySelector('.variable-dialog-input');
            const varName = input.value.trim();
            
            if (!varName) {
                alert('请输入变量名');
                return;
            }
            
            try {
                // 创建变量
                workspace.createVariable(varName);
                input.value = '';
                this.hideDialog();
                
                // 刷新工具箱
                if (workspace.toolbox_) {
                    workspace.toolbox_.refreshSelection();
                }
            } catch (e) {
                console.error('创建变量失败:', e);
                alert('创建变量失败: ' + e.message);
            }
        }
    };
})();