// TRUST ANCHOR , terminal
// Presentation only. No rule of the game lives in this file.

export class Terminal {
  constructor(root) {
    this.out = root.querySelector('#out');
    this.input = root.querySelector('#in');
    this.hud = {
      privacy: root.querySelector('#hp'),
      trust: root.querySelector('#ht'),
      disclosures: root.querySelector('#hd')
    };
    root.addEventListener('click', () => this.input.focus());
  }

  write(text, cls) {
    const el = document.createElement('div');
    if (cls) el.className = cls;
    el.textContent = text;
    this.out.appendChild(el);
    this.out.scrollTop = this.out.scrollHeight;
  }

  blank() { this.write(' '); }

  setHud(state) {
    if (!state) return;
    this.hud.privacy.textContent = state.privacy;
    this.hud.trust.textContent = state.trust;
    this.hud.disclosures.textContent = state.disclosures;
    this.hud.privacy.style.color = state.privacy < 60 ? 'var(--red)' : 'var(--amber)';
  }

  onSubmit(handler) {
    this.input.closest('form').addEventListener('submit', e => {
      e.preventDefault();
      const v = this.input.value;
      this.input.value = '';
      handler(v);
    });
  }
}
