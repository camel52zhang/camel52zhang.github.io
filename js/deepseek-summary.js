async function fetchArticleSummary(content) {
  const apiKey = 'sk-257a1afc3d08431395a900b55464ce9e';
  const endpoint = '/api/summarize'; // 本地代理路径

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text: content,
        length: 'short', // 摘要长度，可选值：short, medium, long
      }),
    });

    if (!response.ok) throw new Error('API 请求失败');

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('获取文章摘要失败:', error);
    return null;
  }
}
