// public/js/age-verification-widget.js
const AgeVerificationWidget = (() => {
  let eshopId = null;
  let options = {};
  const eventHandlers = {};

  /**
   * Inicializuje widget s daným eshopId a konfiguračními možnostmi.
   * @param {string} _eshopId
   * @param {object} _options
   */
  function init(_eshopId, _options = {}) {
    eshopId = _eshopId;
    options = _options;
    // Dynamicky vložíme modální okno, pokud ještě neexistuje
    if (!document.getElementById('age-verification-modal')) {
      const modal = document.createElement('div');
      modal.id = 'age-verification-modal';
      modal.style.display = 'none';
      modal.innerHTML = `
        <div class="avw-modal-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6);">
          <div class="avw-modal-content" style="margin: 10% auto; padding: 1rem; background: #fff; max-width: 600px; border-radius: 8px;">
            <h1>${options.modalTitle || "Ověření věku"}</h1>
            <div id="avw-modal-body">
              <p>${options.introText || "Prosím, ověřte svůj věk."}</p>
              <!-- Další obsah modálu lze dynamicky doplnit -->
            </div>
            <button id="avw-close-button" style="margin-top: 1rem;">Zavřít</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      document.getElementById('avw-close-button').addEventListener('click', () => closeModal());
    }
    emit('init', { eshopId, options });
  }

  /**
   * Otevře modální okno widgetu.
   */
  function openModal() {
    const modal = document.getElementById('age-verification-modal');
    if (modal) {
      modal.style.display = 'block';
      emit('open', { eshopId });
    }
  }

  /**
   * Zavře modální okno widgetu.
   */
  function closeModal() {
    const modal = document.getElementById('age-verification-modal');
    if (modal) {
      modal.style.display = 'none';
      emit('close', { eshopId });
    }
  }

  /**
   * Registruje callback funkci pro danou událost.
   * @param {string} eventName
   * @param {function} callback
   */
  function on(eventName, callback) {
    if (!eventHandlers[eventName]) {
      eventHandlers[eventName] = [];
    }
    eventHandlers[eventName].push(callback);
  }

  /**
   * Emituje událost se zadanými daty.
   * @param {string} eventName
   * @param {object} data
   */
  function emit(eventName, data) {
    if (eventHandlers[eventName]) {
      eventHandlers[eventName].forEach((cb) => cb(data));
    }
  }

  return {
    init,
    openModal,
    closeModal,
    on
  };
})();

// Exponujeme widget globálně
window.AgeVerificationWidget = AgeVerificationWidget;
