// ===== DATOS DE TODOS LOS VIDEOS (descargados + YouTube) =====
// tipo: 'local' = archivo descargado | 'youtube' = video de YouTube
const videos = [
    // --- VIDEOS DESCARGADOS ---
    { tipo: 'local',   src: 'Matisse, Reik - Eres Tú.mp4',  nombre: 'Matisse, Reik - Eres Tú' },
    { tipo: 'local',   src: 'Maluma-ADMV.mp4',   nombre: 'Maluma-ADMV' },
    { tipo: 'local',   src: 'Chino y Nacho–Andas En Mi Cabeza ft. Daddy Yankee.mp4',   nombre: 'Chino y Nacho–Andas En Mi Cabeza ft. Daddy Yankee' },
    { tipo: 'local',   src: 'Ale Aguirre-Distancia.mp4',   nombre: 'Ale Aguirre-Distancia' },

    // --- VIDEOS DE YOUTUBE ---
    { tipo: 'youtube', id: 'n2Cld9aU1vU',   nombre: 'Diego Luna - Te Amo Y Más' },
    { tipo: 'youtube', id: 'tNTbzidfsNQ',   nombre: 'Reik - Sabes' },
    { tipo: 'youtube', id: '5MR5sjCcciw',   nombre: 'Camila - Solo Para Ti' },
    { tipo: 'youtube', id: 'N2KU_RYclA0',   nombre: 'Ashton Edminster- Break the distance' }
];

let videoActual = -1;

// ===== DRAG DEL CARRUSEL =====
const carruselNormal = document.getElementById('carruselNormal');
let isDown = false;
let startX;
let scrollLeft;

carruselNormal.addEventListener('mousedown', (e) => {
    isDown = true;
    carruselNormal.classList.add('active');
    startX = e.pageX - carruselNormal.offsetLeft;
    scrollLeft = carruselNormal.scrollLeft;
});

carruselNormal.addEventListener('mouseleave', () => {
    isDown = false;
    carruselNormal.classList.remove('active');
});

carruselNormal.addEventListener('mouseup', () => {
    isDown = false;
    carruselNormal.classList.remove('active');
});

carruselNormal.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carruselNormal.offsetLeft;
    const walk = (x - startX) * 2;
    carruselNormal.scrollLeft = scrollLeft - walk;
});

// Touch para móvil
carruselNormal.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - carruselNormal.offsetLeft;
    scrollLeft = carruselNormal.scrollLeft;
});

carruselNormal.addEventListener('touchend', () => {
    isDown = false;
});

carruselNormal.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - carruselNormal.offsetLeft;
    const walk = (x - startX) * 2;
    carruselNormal.scrollLeft = scrollLeft - walk;
});

// ===== CREAR ELEMENTO DE VIDEO PRINCIPAL =====
function crearElementoPrincipal(video, autoplay = true) {
    if (video.tipo === 'youtube') {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${video.id}?${autoplay ? 'autoplay=1&' : ''}rel=0`;
        iframe.title = video.nombre;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.allowFullscreen = true;
        return iframe;
    } else {
        const vid = document.createElement('video');
        vid.src = video.src;
        vid.controls = true;
        if (autoplay) vid.autoplay = true;
        return vid;
    }
}

// ===== CREAR ELEMENTO DE VIDEO LATERAL =====
function crearElementoLateral(video) {
    if (video.tipo === 'youtube') {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${video.id}?rel=0`;
        iframe.title = video.nombre;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.allowFullscreen = true;
        return iframe;
    } else {
        const vid = document.createElement('video');
        vid.src = video.src;
        vid.muted = true;
        return vid;
    }
}

// ===== SELECCIONAR VIDEO (desde el carrusel) =====
function seleccionarVideo(index) {
    videoActual = index;

    const carrusel = document.getElementById('carruselNormal');
    const vistaActiva = document.getElementById('vistaActiva');
    const contenedor = document.getElementById('contenedorPrincipal');
    const btnCerrar = document.querySelector('.btn-cerrar');

    // Ocultar carrusel, mostrar vista activa
    carrusel.classList.add('oculto');
    vistaActiva.classList.add('activa');
    btnCerrar.classList.add('mostrar');

    // Reiniciar animación de zoom
    const videoPrincipal = document.getElementById('videoPrincipal');
    videoPrincipal.style.animation = 'none';
    videoPrincipal.offsetHeight; // reflow para reiniciar
    videoPrincipal.style.animation = '';

    // Poner el video seleccionado en el centro
    contenedor.innerHTML = '';
    contenedor.appendChild(crearElementoPrincipal(videos[index]));

    // Generar los videos laterales
    generarLaterales(index);
}

// ===== GENERAR VIDEOS LATERALES =====
function generarLaterales(indexActivo) {
    const ladoIzquierdo = document.getElementById('ladoIzquierdo');
    const ladoDerecho = document.getElementById('ladoDerecho');

    ladoIzquierdo.innerHTML = '';
    ladoDerecho.innerHTML = '';

    // Videos a la izquierda (índices menores al activo)
    for (let i = 0; i < indexActivo; i++) {
        const div = document.createElement('div');
        div.className = 'video-lateral';
        div.onclick = () => cambiarVideo(i);

        const elem = crearElementoLateral(videos[i]);
        div.appendChild(elem);

        // Overlay para capturar clicks en videos locales
        if (videos[i].tipo === 'local') {
            const overlay = document.createElement('div');
            overlay.className = 'lateral-overlay';
            div.appendChild(overlay);
        }

        ladoIzquierdo.appendChild(div);
    }

    // Videos a la derecha (índices mayores al activo)
    for (let i = indexActivo + 1; i < videos.length; i++) {
        const div = document.createElement('div');
        div.className = 'video-lateral';
        div.onclick = () => cambiarVideo(i);

        const elem = crearElementoLateral(videos[i]);
        div.appendChild(elem);

        // Overlay para capturar clicks en videos locales
        if (videos[i].tipo === 'local') {
            const overlay = document.createElement('div');
            overlay.className = 'lateral-overlay';
            div.appendChild(overlay);
        }

        ladoDerecho.appendChild(div);
    }
}

// ===== CAMBIAR A OTRO VIDEO =====
function cambiarVideo(index) {
    if (index === videoActual) return;
    videoActual = index;

    const contenedor = document.getElementById('contenedorPrincipal');

    // Reiniciar animación de zoom
    const videoPrincipal = document.getElementById('videoPrincipal');
    videoPrincipal.style.animation = 'none';
    videoPrincipal.offsetHeight;
    videoPrincipal.style.animation = '';

    contenedor.innerHTML = '';
    contenedor.appendChild(crearElementoPrincipal(videos[index]));

    generarLaterales(index);
}

// ===== CERRAR VIDEO Y VOLVER AL CARRUSEL =====
function cerrarVideo() {
    videoActual = -1;

    const carrusel = document.getElementById('carruselNormal');
    const vistaActiva = document.getElementById('vistaActiva');
    const contenedor = document.getElementById('contenedorPrincipal');
    const btnCerrar = document.querySelector('.btn-cerrar');

    // Mostrar carrusel, ocultar vista activa
    carrusel.classList.remove('oculto');
    vistaActiva.classList.remove('activa');
    btnCerrar.classList.remove('mostrar');

    // Detener y limpiar el video principal
    contenedor.innerHTML = '';

    // Limpiar laterales
    document.getElementById('ladoIzquierdo').innerHTML = '';
    document.getElementById('ladoDerecho').innerHTML = '';
}

// ===== CARRUSEL DE TARJETAS CON DRAG =====
const cardSliders = document.querySelectorAll(".carousel-container");

cardSliders.forEach(slider => {
    let isDownCard = false;
    let startXCard;
    let scrollLeftCard;

    slider.addEventListener("mousedown", (e) => {
        isDownCard = true;
        slider.classList.add("active");
        startXCard = e.pageX - slider.offsetLeft;
        scrollLeftCard = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
        isDownCard = false;
        slider.classList.remove("active");
    });

    slider.addEventListener("mouseup", () => {
        isDownCard = false;
        slider.classList.remove("active");
    });

    slider.addEventListener("mousemove", (e) => {
        if (!isDownCard) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startXCard) * 2;
        slider.scrollLeft = scrollLeftCard - walk;
    });

    slider.addEventListener("touchstart", (e) => {
        isDownCard = true;
        startXCard = e.touches[0].pageX - slider.offsetLeft;
        scrollLeftCard = slider.scrollLeft;
    });

    slider.addEventListener("touchend", () => {
        isDownCard = false;
    });

    slider.addEventListener("touchmove", (e) => {
        if (!isDownCard) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startXCard) * 2;
        slider.scrollLeft = scrollLeftCard - walk;
    });
});

// ===== MODAL DE TARJETA =====
const cards = document.querySelectorAll(".card");
const cardModal = document.getElementById("cardModal");
const cardModalBg = document.getElementById("cardModalBg");
const cardModalTitle = document.getElementById("cardModalTitle");
const cardModalDesc = document.getElementById("cardModalDesc");
const closeCardModal = document.querySelector(".close-card-modal");

cards.forEach(card => {
    card.addEventListener("click", () => {
        const imagen = card.getAttribute("data-imagen");
        const titulo = card.querySelector("h3").textContent;
        const desc = card.querySelector("p").textContent;

        cardModalBg.style.backgroundImage = `url('${imagen}')`;
        cardModalTitle.textContent = titulo;
        cardModalDesc.textContent = desc + "\n\n";

        cardModal.classList.add("active");
    });
});

closeCardModal.addEventListener("click", () => {
    cardModal.classList.remove("active");
});

cardModal.addEventListener("click", (e) => {
    if (e.target === cardModal) {
        cardModal.classList.remove("active");
    }
});

// ===== CORAZÓN CON LATIDO =====
const canvas = document.getElementById("pinkboard");
const ctx = canvas.getContext("2d");
const contenedor = document.querySelector(".carrusel-con-corazon");

function resizeCanvas() {
    canvas.width = contenedor.offsetWidth;
    canvas.height = contenedor.offsetHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = [];
const TOTAL = 1200;

function heart(t) {
    return {
        x: 16 * Math.pow(Math.sin(t), 3),
        y: 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    };
}

for (let i = 0; i < TOTAL; i++) {
    let t = Math.random() * Math.PI * 2;
    let p = heart(t);
    particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 500,
        tx: canvas.width / 2 + p.x * 18,
        ty: canvas.height / 2 - p.y * 18,
        size: 2 + Math.random() * 2,
        speed: 0.01 + Math.random() * 0.02,
        offset: Math.random() * 100
    });
}

function drawHeart(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
        x - s, y - s,
        x - s * 2, y + s,
        x, y + s * 2
    );
    ctx.bezierCurveTo(
        x + s * 2, y + s,
        x + s, y - s,
        x, y
    );
    ctx.fillStyle = "#ff9ad5";
    ctx.fill();
}

let time = 0;

function animate() {
    time += 0.03;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let beatScale = 1 + Math.sin(time * 2.5) * 0.08;

    particles.forEach(p => {
        p.x += (p.tx - p.x) * p.speed;
        p.y += (p.ty - p.y) * p.speed;

        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;

        let relX = p.x - centerX;
        let relY = p.y - centerY;

        let beatX = centerX + relX * beatScale;
        let beatY = centerY + relY * beatScale;

        let pulseX = Math.sin(time + p.offset) * 1.5;
        let pulseY = Math.cos(time + p.offset) * 1.5;

        drawHeart(beatX + pulseX, beatY + pulseY, p.size);
    });

    requestAnimationFrame(animate);
}

animate();