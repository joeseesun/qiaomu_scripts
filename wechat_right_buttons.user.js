// ==UserScript==
// @name         微信公众号右侧自定义按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       向阳乔木
// @description  在微信公众号后台右侧添加跳转和弹窗按钮
// @match        https://mp.weixin.qq.com/cgi-bin/appmsg*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForSidebar(callback) {
        const interval = setInterval(() => {
            // 右侧栏容器选择器，可能需要根据实际页面调整
            const sidebar = document.querySelector('.weui-desktop-layout__side, .weui-desktop-layout__aside, .side_bar, .main_bd');
            if (sidebar) {
                clearInterval(interval);
                callback(sidebar);
            }
        }, 500);
    }

    // 创建按钮和弹窗
    function createButtons() {
        // 按钮容器
        const btnContainer = document.createElement('div');
        btnContainer.style.margin = '20px 0';
        btnContainer.style.display = 'flex';
        btnContainer.style.flexDirection = 'column';
        btnContainer.style.gap = '16px';
        btnContainer.style.alignItems = 'center';
        btnContainer.style.background = 'none';

        // 通用按钮样式
        function makeIconBtn(svg, ariaLabel) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('aria-label', ariaLabel);
            btn.style.width = '40px';
            btn.style.height = '40px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.background = '#f5f6fa';
            btn.style.border = 'none';
            btn.style.borderRadius = '50%';
            btn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
            btn.style.cursor = 'pointer';
            btn.style.transition = 'box-shadow 0.2s, background 0.2s';
            btn.style.outline = 'none';
            btn.onmouseover = function() {
                btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
                btn.style.background = '#e9ebf0';
            };
            btn.onmouseout = function() {
                btn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                btn.style.background = '#f5f6fa';
            };
            btn.innerHTML = svg;
            return btn;
        }

        // 只保留一个复制图标按钮
        const copySvg = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="3" width="8" height="14" rx="2" stroke="#4C4D4E" stroke-width="1.5"/><rect x="5" y="5" width="8" height="14" rx="2" fill="#E9EBF0" stroke="#B2B2B2" stroke-width="1.2"/></svg>`;
        const copyBtn = makeIconBtn(copySvg, '快捷复制');
        copyBtn.onclick = function() {
            showPopup();
        };

        btnContainer.appendChild(copyBtn);
        // 插入到.weui-desktop-online-faq模块上方
        const faqModule = document.querySelector('.weui-desktop-online-faq');
        if (faqModule && faqModule.parentNode) {
            faqModule.parentNode.insertBefore(btnContainer, faqModule);
        } else {
            // 如果找不到FAQ模块，默认插入到body顶部
            document.body.prepend(btnContainer);
        }
    }

    // 弹窗内容
    const popupTexts = [
        '“关键字”位于画面中心的大胆手绘字体，具有强烈的视觉冲击力。文字呈现不规则排版，部分字体故意倾斜或扭曲，营造出讽刺与幽默的张力。采用黑白主色调，辅以少量鲜艳的霓虹色点缀关键词。字体风格融合了街头涂鸦与现代排版艺术，部分笔画呈现出喷溅或墨水滴落效果。背景简约克制，突出文字本身的力量。整体构图平衡但不对称，营造出视觉节奏感。细节精致，笔触清晰可见，呈现手工质感。风格介于极简主义与先锋艺术之间，超高清2K分辨率，适合近距离欣赏细节',
        '"关键字"，工质风格融合科幻未来感，字体结构机械锐利如精密零件组合，边缘呈现金属切割感与磨损纹理，深色铁锈与机械灰工业背景，点缀芯片纹理与铆钉细节装饰，文字表面呈现金属拉丝与局部抛光效果，字形采用几何拼接重组布局如工业图纸，整体营造出厚重工业与尖端科技的复合层次，冷峻而强大的工业氛围中透出未来科技的秩序感，高级机械工业视觉',
        '“关键字”位于画面中心的大胆手绘字体，具有强烈的视觉冲击力。文字呈现不规则排版，部分字体故意倾斜或扭曲，营造出讽刺与幽默的张力。采用黑白主色调，辅以少量鲜艳的霓虹色点缀关键词。字体风格融合了街头涂鸦与现代排版艺术，部分笔画呈现出喷溅或墨水滴落效果。背景简约克制，突出文字本身的力量。整体构图平衡但不对称，营造出视觉节奏感。细节精致，笔触清晰可见，呈现手工质感。风格介于极简主义与先锋艺术之间，超高清2K分辨率，适合近距离欣赏细节',
        '“关键字”，印象风格融合清逸手写质感，字体结构轻盈自然如随风摇曳，边缘柔和渐变带水彩晕染效果，明媚阳光下的自然风景与蓝天白云背景，点缀飘舞花瓣与阳光斑驳光影，文字表面呈现轻柔水彩与自然笔触质感，字形排列舒展流畅如愉快心情的表达，整体营造出明媚春日与愉悦心情的和谐层次，轻松而满足的欢快氛围中透出对美好生活的珍视，高级自然印象视觉',
    ];

    // 创建弹窗
    function showPopup() {
        // 避免重复弹窗
        if (document.getElementById('custom-popup')) return;

        const overlay = document.createElement('div');
        overlay.id = 'custom-popup';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.3)';
        overlay.style.zIndex = '9999';
        overlay.onclick = function(e) {
            if (e.target === overlay) overlay.remove();
        };

        const popup = document.createElement('div');
        popup.style.background = '#fff';
        popup.style.padding = '24px 32px';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
        popup.style.position = 'absolute';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.minWidth = '320px';

        const title = document.createElement('div');
        title.innerText = '点击下方文本可复制';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '16px';
        popup.appendChild(title);

        popupTexts.forEach(text => {
            const textDiv = document.createElement('div');
            textDiv.innerText = text;
            textDiv.style.padding = '8px';
            textDiv.style.marginBottom = '8px';
            textDiv.style.background = '#f5f5f5';
            textDiv.style.borderRadius = '4px';
            textDiv.style.cursor = 'pointer';
            textDiv.onclick = function() {
                if (typeof GM_setClipboard !== 'undefined') {
                    GM_setClipboard(text);
                } else {
                    navigator.clipboard.writeText(text);
                }
                textDiv.innerText = '已复制✔️';
                setTimeout(() => { textDiv.innerText = text; }, 1000);
            };
            popup.appendChild(textDiv);
        });

        // 按钮区域
        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.justifyContent = 'flex-end';
        btnRow.style.gap = '12px';
        btnRow.style.marginTop = '12px';

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerText = '关闭';
        closeBtn.style.padding = '6px 16px';
        closeBtn.style.background = '#e0e0e0';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = function() {
            overlay.remove();
        };
        btnRow.appendChild(closeBtn);

        // 打开即梦按钮
        const jimengBtn = document.createElement('button');
        jimengBtn.innerText = '打开即梦';
        jimengBtn.style.padding = '6px 16px';
        jimengBtn.style.background = '#4caf50';
        jimengBtn.style.color = '#fff';
        jimengBtn.style.border = 'none';
        jimengBtn.style.borderRadius = '4px';
        jimengBtn.style.cursor = 'pointer';
        jimengBtn.onclick = function() {
            window.open('https://jimeng.jianying.com/ai-tool/image/generate', '_blank');
        };
        btnRow.appendChild(jimengBtn);

        popup.appendChild(btnRow);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }

    // 主流程
    function waitForFaqAndInsert() {
        const interval = setInterval(() => {
            const faqModule = document.querySelector('.weui-desktop-online-faq');
            if (faqModule) {
                clearInterval(interval);
                createButtons();
            }
        }, 500);
    }
    waitForFaqAndInsert();
})(); 
