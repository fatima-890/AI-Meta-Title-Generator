(function () {
  const root = document.getElementById('amg-root');
  const contentEl = root.querySelector('#amg-content');
  const keywordEl = root.querySelector('#amg-keyword');
  const apiKeyEl = root.querySelector('#amg-apikey');
  const btn = root.querySelector('#amg-generate-btn');
  const errorEl = root.querySelector('#amg-error');
  const resultsEl = root.querySelector('#amg-results');

  const STORAGE_KEY = 'amg_gemini_api_key';
  const savedKey = window.localStorage ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (savedKey) apiKeyEl.value = savedKey;

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }
  function clearError() {
    errorEl.style.display = 'none';
    errorEl.textContent = '';
  }

  function charCountClass(len, min, max) {
    return (len < min || len > max) ? 'amg-char-count amg-over' : 'amg-char-count';
  }

  function renderResults(items) {
    resultsEl.innerHTML = '';
    items.forEach(function (item, idx) {
      const wrap = document.createElement('div');
      wrap.className = 'amg-result-item';

      const titleLen = item.title.length;
      const descLen = item.description.length;

      wrap.innerHTML =
        '<div class="amg-label-row">' +
          '<span class="amg-field-label">OPTION ' + (idx + 1) + ' — TITLE</span>' +
          '<span class="' + charCountClass(titleLen, 50, 60) + '">' + titleLen + ' / 60</span>' +
        '</div>' +
        '<p class="amg-field-text amg-serp-title">' + item.title + '</p>' +
        '<button class="amg-copy-btn" data-copy="' + encodeURIComponent(item.title) + '">Copy title</button>' +

        '<div class="amg-label-row" style="margin-top:14px;">' +
          '<span class="amg-field-label">DESCRIPTION</span>' +
          '<span class="' + charCountClass(descLen, 140, 160) + '">' + descLen + ' / 160</span>' +
        '</div>' +
        '<p class="amg-field-text amg-serp-desc">' + item.description + '</p>' +
        '<button class="amg-copy-btn" data-copy="' + encodeURIComponent(item.description) + '">Copy description</button>';

      resultsEl.appendChild(wrap);
    });

    resultsEl.querySelectorAll('.amg-copy-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        const text = decodeURIComponent(b.getAttribute('data-copy'));
        navigator.clipboard.writeText(text).then(function () {
          const orig = b.textContent;
          b.textContent = 'Copied!';
          setTimeout(function () { b.textContent = orig; }, 1200);
        });
      });
    });

    resultsEl.style.display = 'block';
  }

  function buildPrompt(content, keyword) {
    return (
      'You are an SEO copywriter. Based on the page content below, write 3 distinct options ' +
      'for an SEO title tag and meta description.\n\n' +
      'Rules:\n' +
      '- Title tag: 50-60 characters, compelling, includes the target keyword naturally if provided.\n' +
      '- Meta description: 140-160 characters, includes a reason to click, includes the target keyword naturally if provided.\n' +
      '- No quotation marks, no markdown, no emojis.\n' +
      (keyword ? ('- Target keyword: "' + keyword + '"\n') : '') +
      '\nRespond ONLY with valid JSON, no other text, in this exact shape:\n' +
      '{"options":[{"title":"...","description":"..."},{"title":"...","description":"..."},{"title":"...","description":"..."}]}\n\n' +
      'PAGE CONTENT:\n' + content.slice(0, 6000)
    );
  }

  async function callGemini(apiKey, prompt) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + encodeURIComponent(apiKey);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error('API error (' + res.status + '): ' + errBody.slice(0, 200));
    }

    const data = await res.json();
    const text = data.candidates && data.candidates[0] && data.candidates[0].content &&
      data.candidates[0].content.parts && data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text;

    if (!text) throw new Error('No response from the model. Try again.');

    const cleaned = text.replace(/```json|```/g, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      throw new Error('Could not read the model\'s response. Try again.');
    }
    if (!parsed.options || !Array.isArray(parsed.options)) {
      throw new Error('Unexpected response shape. Try again.');
    }
    return parsed.options;
  }

  btn.addEventListener('click', async function () {
    clearError();
    resultsEl.style.display = 'none';

    const content = contentEl.value.trim();
    const keyword = keywordEl.value.trim();
    const apiKey = apiKeyEl.value.trim();

    if (!content || content.length < 40) {
      showError('Paste at least a short paragraph of page content first.');
      return;
    }
    if (!apiKey) {
      showError('Add your Gemini API key above (it\'s free — see the link).');
      return;
    }

    if (window.localStorage) window.localStorage.setItem(STORAGE_KEY, apiKey);

    btn.disabled = true;
    btn.textContent = 'Generating...';

    try {
      const prompt = buildPrompt(content, keyword);
      const options = await callGemini(apiKey, prompt);
      renderResults(options);
    } catch (err) {
      showError(err.message || 'Something went wrong. Please try again.');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Generate Title & Description';
    }
  });
})();