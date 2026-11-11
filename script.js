const FORM_ENDPOINT = "";            
const WHATSAPP_NUMBER = "3505311700";

const appData = {
  treatments: [
    {
      titleEs: "Carillas de porcelana E-MAX",
      titleEn: "E-MAX porcelain veneers",
      descEs: "Carillas ultrafinas que se ven indistinguibles del esmalte natural.",
      descEn: "Ultra-thin veneers designed to look indistinguishable from natural enamel.",
      category: "estetica",
      img: "img12.png",
    },
    {
      titleEs: "Implantes dentales",
      titleEn: "Dental implants",
      descEs: "Reemplazo de dientes con planificación precisa y resultados estables y naturales.",
      descEn: "Tooth replacement with precise planning and stable, natural-looking results.",
      category: "restauracion",
      img: "img9.webp",
    },
    {
      titleEs: "Blanqueamiento dental",
      titleEn: "Teeth whitening",
      descEs: "Una sonrisa más luminosa de forma segura.",
      descEn: "A brighter smile, done safely.",
      category: "estetica",
      img: "img6.jpg",
      icon: ""
    }
  ],
  results: [
    {
      titleEs: "Carillas de porcelana E-MAX",
      titleEn: "E-MAX porcelain veneers",
      descEs: "Diseño de sonrisa con carillas de porcelana: forma, color y textura naturales.",
      descEn: "Smile design with porcelain veneers: natural shape, color and texture.",
      img: "img8.webp"
    }
  ],
  who: {
    whatEs: "Hacemos odontología cosmética y restauradora: carillas, implantes, blanqueamiento y diseño de sonrisa con enfoque personalizado.",
    whatEn: "We do cosmetic and restorative dentistry: veneers, implants, whitening and smile design with a personalized approach.",
    whereEs: "Estamos en Pompano Beach, Florida. Atendemos pacientes de todo el sur de Florida.",
    whereEn: "We are located in Pompano Beach, Florida. We see patients from all over South Florida.",
    howEs: "Usamos planificación digital, materiales de alta calidad y un seguimiento cercano en cada etapa del tratamiento.",
    howEn: "We use digital planning, high-quality materials and close follow-up at every stage of treatment."
  }
};

let currentFilter = 'all';

function t(es, en) {
  return document.documentElement.lang === 'es' ? es : en;
}

function setLang(lang) {
  document.documentElement.lang = lang;
  document.getElementById('btn-es').classList.toggle('active', lang === 'es');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  try { localStorage.setItem('lang', lang); } catch (e) {}
  renderAll();
}

function renderWho() {
  const grid = document.getElementById('who-grid');
  if (!grid) return;
  const w = appData.who;
  grid.innerHTML = `
    <div class="who-card">
      <div class="who-num">01</div>
      <h3>${t('Qué hacemos', 'What we do')}</h3>
      <p>${t(w.whatEs, w.whatEn)}</p>
    </div>
    <div class="who-card">
      <div class="who-num">02</div>
      <h3>${t('Dónde lo hacemos', 'Where we do it')}</h3>
      <p>${t(w.whereEs, w.whereEn)}</p>
    </div>
    <div class="who-card">
      <div class="who-num">03</div>
      <h3>${t('Cómo lo hacemos', 'How we do it')}</h3>
      <p>${t(w.howEs, w.howEn)}</p>
    </div>`;
}

function renderTreatments() {
  const grid = document.getElementById('treatments-grid');
  if (!grid) return;
  const list = currentFilter === 'all'
    ? appData.treatments
    : appData.treatments.filter(item => item.category === currentFilter);

  grid.innerHTML = list.map(item => {
    const title = t(item.titleEs, item.titleEn);
    const media = item.img
      ? `<img src="${item.img}" alt="${title}" loading="lazy" />`
      : `<div class="img-placeholder" aria-hidden="true">${item.icon || '🦷'}</div>`;
    return `
      <div class="treat-card" data-category="${item.category}">
        <div class="treat-img">${media}</div>
        <div class="treat-body">
          <h3>${title}</h3>
          <p>${t(item.descEs, item.descEn)}</p>
        </div>
      </div>`;
  }).join('');
}

function renderResults() {
  const grid = document.getElementById('results-grid');
  if (!grid) return;
  grid.innerHTML = appData.results.map(item => {
    const title = t(item.titleEs, item.titleEn);
    return `
      <div class="result-card">
        <div class="result-img"><img src="${item.img}" alt="${title}" loading="lazy" /></div>
        <div class="result-body">
          <h3>${title}</h3>
          <p>${t(item.descEs, item.descEn)}</p>
        </div>
      </div>`;
  }).join('');
}

function renderAll() {
  renderWho();
  renderTreatments();
  renderResults();
}

document.getElementById('filter-bar').addEventListener('click', function (e) {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = btn.dataset.filter;
  renderTreatments();
});

const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');
const formFail = document.getElementById('form-fail');
const fields = {
  name: { input: document.getElementById('name'), error: document.getElementById('error-name') },
  phone: { input: document.getElementById('phone'), error: document.getElementById('error-phone') },
  service: { input: document.getElementById('service'), error: document.getElementById('error-service') }
};

function clearErrors() {
  Object.values(fields).forEach(f => {
    f.error.textContent = '';
    f.input.classList.remove('error');
  });
  formSuccess.hidden = true;
  formFail.hidden = true;
}

function setError(key, msg) {
  fields[key].error.textContent = msg;
  fields[key].input.classList.add('error');
}

function validateForm() {
  clearErrors();
  let ok = true;
  const name = fields.name.input.value.trim();
  const phone = fields.phone.input.value.trim();
  const service = fields.service.input.value;

  if (!name) { setError('name', t('El nombre es obligatorio', 'Name is required')); ok = false; }
  else if (name.length < 2) { setError('name', t('Escribe al menos 2 caracteres', 'Write at least 2 characters')); ok = false; }

  if (!phone) { setError('phone', t('El teléfono es obligatorio', 'Phone is required')); ok = false; }
  else if (!/^[\d\s\-\+\(\)]{7,18}$/.test(phone)) { setError('phone', t('Teléfono no válido', 'Invalid phone number')); ok = false; }

  if (!service) { setError('service', t('Elige un tratamiento', 'Choose a treatment')); ok = false; }

  return ok;
}

function openWhatsApp(data) {
  const text =
    `Hola, quiero agendar una consulta.\n` +
    `Nombre: ${data.name}\n` +
    `Teléfono: ${data.phone}\n` +
    (data.email ? `Email: ${data.email}\n` : '') +
    `Tratamiento: ${data.service}\n` +
    (data.message ? `Mensaje: ${data.message}` : '');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const data = {
    name: fields.name.input.value.trim(),
    phone: fields.phone.input.value.trim(),
    email: document.getElementById('email').value.trim(),
    service: fields.service.input.value,
    message: document.getElementById('message').value.trim(),
    _gotcha: form.elements['_gotcha'].value
  };

  if (!FORM_ENDPOINT) {
    submitBtn.disabled = true;
    try {
      const body = new URLSearchParams({ 'form-name': 'contacto', ...data });
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      formSuccess.textContent = t('¡Gracias! Te contactaremos pronto.', 'Thank you! We will contact you soon.');
      formSuccess.hidden = false;
      form.reset();
    } catch (err) {
      openWhatsApp(data);
      formSuccess.textContent = t('Se abrió WhatsApp con tu mensaje. ¡Gracias!', 'WhatsApp opened with your message. Thank you!');
      formSuccess.hidden = false;
      form.reset();
    } finally {
      submitBtn.disabled = false;
    }
    return;
  }

  submitBtn.disabled = true;
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    formSuccess.textContent = t('¡Gracias! Te contactaremos pronto.', 'Thank you! We will contact you soon.');
    formSuccess.hidden = false;
    form.reset();
  } catch (err) {
    formFail.textContent = t(
      'No se pudo enviar. Inténtalo de nuevo o escríbenos por WhatsApp.',
      'Could not send. Please try again or message us on WhatsApp.'
    );
    formFail.hidden = false;
  } finally {
    submitBtn.disabled = false;
  }
});

document.getElementById('btn-es').addEventListener('click', () => setLang('es'));
document.getElementById('btn-en').addEventListener('click', () => setLang('en'));

let savedLang = 'es';
try { savedLang = localStorage.getItem('lang') || 'es'; } catch (e) {}
setLang(savedLang === 'en' ? 'en' : 'es');