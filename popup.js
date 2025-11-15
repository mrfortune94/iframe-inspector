document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getIframes" }, async (response) => {
      const container = document.getElementById('iframeList');
      container.innerHTML = '';

      if (!response || !response.iframes.length) {
        container.innerText = 'No iframes found on this page.';
        return;
      }

      for (const iframe of response.iframes) {
        const div = document.createElement('div');
        div.className = 'iframe-entry';

        const title = document.createElement('h4');
        title.textContent = `Src: ${iframe.src || '(empty)'}`;
        div.appendChild(title);

        const attrs = document.createElement('pre');
        attrs.textContent = JSON.stringify(iframe.attributes, null, 2);
        div.appendChild(attrs);

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download iframe source';

        downloadBtn.onclick = async () => {
          try {
            const res = await fetch(iframe.src);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const html = await res.text();
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `iframe_source_${Date.now()}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } catch (e) {
            alert(`Failed to fetch iframe source: ${e.message}
(CORS restrictions likely)`);
          }
        };
        div.appendChild(downloadBtn);

        container.appendChild(div);
      }
    });
  });
});
