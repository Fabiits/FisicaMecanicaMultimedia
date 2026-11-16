const profileData = (() => {
  const root = 'fisica-mecanica:perfil:v1:';
  const previous = 'fisica-mecanica:objetivos:v1:';
  const volatile = new Map();
  let persistent = true;
  let active = null;

  function load(key) {
    if (volatile.has(key)) return volatile.get(key);
    try { return localStorage.getItem(key); }
    catch { persistent = false; return null; }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, value);
      volatile.delete(key);
    } catch {
      persistent = false;
      volatile.set(key, value);
    }
  }

  function getProfiles() {
    const keys = new Set(volatile.keys());
    try {
      for (let index = 0; index < localStorage.length; index++) keys.add(localStorage.key(index));
    } catch { persistent = false; }
    return [...keys].filter(key => key?.startsWith(root + 'nombre:')).map(key => ({
      id: key.slice((root + 'nombre:').length), name: load(key)
    })).filter(profile => profile.name).sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }

  function legacyAvailable() {
    if (load(root + 'partida-anterior')) return false;
    try {
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (key?.startsWith(previous) && load(key) === '1') return true;
      }
    } catch { persistent = false; }
    return false;
  }

  function start(name, claimLegacy) {
    const id = encodeURIComponent(name.normalize('NFKC').toLocaleLowerCase('es'));
    const key = root + 'nombre:' + id;
    const recorded = load(key) || name;
    save(key, recorded);
    if (claimLegacy && legacyAvailable()) save(root + 'partida-anterior', id);
    use({id, name: recorded});
  }

  function use(profile) {
    active = profile;
    try {
      if (active) sessionStorage.setItem(root + 'activo', active.id);
      else sessionStorage.removeItem(root + 'activo');
    } catch {}
  }

  function resume() {
    let id;
    try { id = sessionStorage.getItem(root + 'activo'); } catch {}
    const name = id && load(root + 'nombre:' + id);
    if (name) use({id, name});
  }

  return {
    start, use, resume, getProfiles, legacyAvailable,
    get active() { return active; },
    get persistent() { return persistent; },
    read(key) {
      if (!active) return null;
      return load(root + 'datos:' + active.id + ':' + key);
    },
    write(key, value) {
      if (active) save(root + 'datos:' + active.id + ':' + key, value);
    },
    readObjective(key) {
      return this.read('objetivo:' + key) || (active && load(root + 'partida-anterior') === active.id && load(previous + key));
    },
    observes(key) { return !key || key.startsWith(root) || key.startsWith(previous); }
  };
})();

function setupProfiles(onChange) {
  const dialog = document.getElementById('profile-dialog');
  const form = document.getElementById('profile-form');
  const input = document.getElementById('profile-name');
  const saved = document.getElementById('saved-profiles');
  const choices = document.getElementById('profile-choices');
  const importOld = document.getElementById('profile-import');
  const importRow = document.getElementById('profile-import-row');
  const close = document.getElementById('profile-close');
  const signOut = document.getElementById('profile-logout');
  const note = document.getElementById('profile-note');

  function open() {
    if (dialog.open) return;
    form.reset();
    const profiles = profileData.getProfiles();
    saved.hidden = profiles.length === 0;
    choices.replaceChildren();
    for (const profile of profiles) {
      const button = document.createElement('button');
      button.className = 'button secondary';
      button.type = 'button';
      button.textContent = profile.name;
      button.addEventListener('click', () => {
        profileData.start(profile.name, importOld.checked);
        finish();
      });
      choices.append(button);
    }
    close.hidden = signOut.hidden = !profileData.active;
    importRow.hidden = !profileData.legacyAvailable();
    note.textContent = profileData.persistent
      ? 'Tu partida queda guardada en este navegador.'
      : 'Este navegador solo permite guardar la partida mientras esta página siga abierta.';
    dialog.showModal();
    input.focus();
  }

  function finish() {
    dialog.close();
    onChange();
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = input.value.normalize('NFKC').trim().replace(/\s+/g, ' ');
    if (name.length < 2 || name.length > 32) {
      input.setCustomValidity('Escribe un nombre de 2 a 32 caracteres.');
      input.reportValidity();
      return;
    }
    profileData.start(name, importOld.checked);
    finish();
  });
  input.addEventListener('input', () => input.setCustomValidity(''));
  close.addEventListener('click', () => dialog.close());
  signOut.addEventListener('click', () => {
    profileData.use(null);
    dialog.close();
    onChange();
    open();
  });
  dialog.addEventListener('cancel', event => {
    if (!profileData.active) event.preventDefault();
  });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-open-profile]')) open();
  });

  profileData.resume();
  onChange();
  if (!profileData.active) open();
}

