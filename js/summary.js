async function generateSummary() {
    const articleContent = document.querySelector('.post-content').innerText; // 获取文章内容
    const summaryElement = document.getElementById('article-summary');

    try {
        const response = await fetch('https://api.deepseek.com/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'sk-257a1afc3d08431395a900b55464ce9e' // 替换为您的 API Key
            },
            body: JSON.stringify({
                text: articleContent,
                max_length: 150 // 摘要的最大长度
            })
        });

        if (!response.ok) {
            throw new Error(`API 调用失败，状态码: ${response.status}`);
        }

        const data = await response.json();
        console.log('API 响应:', data); // 打印 API 响应
        summaryElement.innerHTML = `<p>${data.summary}</p>`;
    } catch (error) {
        console.error('错误详情:', error); // 打印错误详情
        summaryElement.innerHTML = `<p>摘要生成失败，请稍后重试。</p>`;
    }
}

// 页面加载完成后调用
window.addEventListener('load', generateSummary);