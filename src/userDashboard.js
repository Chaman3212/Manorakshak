(function () {
  const qs = (sel) => document.querySelector(sel);

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  function render() {
    // Dummy data; can be wired to actual analysis later
    const healthCondition = {
      mood: "Stable",
      stressLevel: "Low",
      note: "You're doing great. Keep your breathing steady."
    };

    const contentTypes = [
      { label: "Educational", count: 5 },
      { label: "News", count: 3 },
      { label: "Social Media", count: 4 },
      { label: "Entertainment", count: 2 }
    ];

    const tips = [
      "Take a 5-minute mindful break.",
      "Hydrate and stretch your shoulders.",
      "Keep notifications minimal during focus blocks.",
      "Practice box breathing: 4-4-4-4."
    ];

    setText(qs('#health-status'), `${healthCondition.mood} • Stress: ${healthCondition.stressLevel} — ${healthCondition.note}`);

    const contentList = qs('#content-types');
    contentList.innerHTML = '';
    contentTypes.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = `${item.label}: ${item.count}`;
      contentList.appendChild(li);
    });

    // Stats
    setText(qs('#stat-focus'), String(Math.floor(Math.random() * 4) + 1));
    setText(qs('#stat-mindful'), `${Math.floor(Math.random() * 30) + 10} mins`);

    // Calm Mode from chrome.storage.local
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['calmModeEnabled'], (res) => {
          setText(qs('#stat-calm'), res?.calmModeEnabled ? 'ON' : 'OFF');
        });
      } else {
        setText(qs('#stat-calm'), '—');
      }
    } catch (_) {
      setText(qs('#stat-calm'), '—');
    }

    // Progress
    const progress = Math.floor(Math.random() * 60) + 20; // 20-80%
    const bar = qs('#progress-bar');
    if (bar) bar.style.width = progress + '%';
    setText(qs('#progress-label'), `${progress}% towards today's goal`);

    // Tips
    const tipsList = qs('#tips-list');
    tipsList.innerHTML = '';
    tips.forEach((t) => {
      const li = document.createElement('li');
      li.textContent = t;
      tipsList.appendChild(li);
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})(); 