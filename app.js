// 1. Importar las funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 2. Tu configuración exacta de LosChilesGo
const firebaseConfig = {
    apiKey: "AIzaSyCiHOa683iPjz5R8WZ59DD2vsbCvWHpVXU",
    authDomain: "loschilesgo.firebaseapp.com",
    projectId: "loschilesgo",
    storageBucket: "loschilesgo.firebasestorage.app",
    messagingSenderId: "12106039784",
    appId: "1:12106039784:web:856de1a86381427cd0645d",
    measurementId: "G-DXWPFXSBLK"
};

// 3. Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. Función principal: Lee datos y crea tarjetas. Acepta "filtroCategoria"
async function obtenerComercios(filtroCategoria = "Todos") {
    try {
        const contenedor = document.getElementById("lista-comercios");
        if (!contenedor) return; 
        
        // Mostrar mensaje de carga mientras busca en la base de datos
        contenedor.innerHTML = `
            <div class="col-span-full py-10 flex justify-center items-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-lc-green"></div>
            </div>
        `;

        const comerciosRef = collection(db, "comercios");
        let consulta = comerciosRef; // Por defecto trae todos

        // Si el usuario eligió una categoría específica, aplicamos el filtro
        if (filtroCategoria !== "Todos") {
            consulta = query(comerciosRef, where("categoria", "==", filtroCategoria));
        }
        
        const querySnapshot = await getDocs(consulta);
        contenedor.innerHTML = ""; // Limpiamos el icono de carga

        // Si no hay resultados para esa categoría
        if (querySnapshot.empty) {
            contenedor.innerHTML = `
                <div class="col-span-full py-16 flex flex-col items-center text-center">
                    <div class="bg-gray-100 p-6 rounded-full mb-4">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-700">Aún no hay comercios aquí</h3>
                    <p class="text-gray-500 mt-2">Pronto agregaremos los mejores lugares de esta categoría en Los Chiles.</p>
                </div>
            `;
            return;
        }
        
        // Construir las tarjetas
        querySnapshot.forEach((doc) => {
            const negocio = doc.data();
            
            // Imagen por defecto con los colores de la marca
            const imagenUrl = negocio.imagen ? negocio.imagen : "https://placehold.co/600x400/f3f4f6/B34728?text=Sin+Foto";
            
            const enlaceMapa = negocio.mapaUrl 
                ? negocio.mapaUrl 
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(negocio.nombre + ' Los Chiles Costa Rica')}`;
            
            const tarjetaHTML = `
                <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden border border-gray-100 flex flex-col transition-all duration-300 group transform hover:-translate-y-1">
                    
                    <div class="relative overflow-hidden h-52">
                        <img src="${imagenUrl}" alt="Foto de ${negocio.nombre}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out">
                        <div class="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-lc-green shadow-sm flex items-center border border-white">
                            ${negocio.categoria || 'Directorio'}
                        </div>
                    </div>
                    
                    <div class="p-5 flex-grow flex flex-col">
                        <h3 class="font-bold text-xl text-gray-800 mb-1 leading-tight group-hover:text-lc-green transition-colors">${negocio.nombre || 'Sin nombre'}</h3>
                        <p class="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">${negocio.categoria || 'Local'}</p>
                        
                        <div class="flex items-center text-lc-gold mb-6 text-sm">
                            ★★★★☆ <span class="text-gray-400 text-xs ml-2 font-medium">(Recomendado)</span>
                        </div>
                        
                        <a href="${enlaceMapa}" target="_blank" class="mt-auto block w-full text-center bg-gray-50 hover:bg-lc-green text-gray-700 hover:text-white py-3 rounded-xl transition-all duration-300 font-bold text-sm border border-gray-200 hover:border-lc-green flex items-center justify-center shadow-sm">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Ver en el mapa
                        </a>
                    </div>
                </div>
            `;
            contenedor.innerHTML += tarjetaHTML;
        });
    } catch (error) {
        console.error("Error al obtener los lugares: ", error);
        document.getElementById("lista-comercios").innerHTML = `
            <div class="col-span-full py-10 text-center text-red-500 bg-red-50 rounded-xl font-bold">
                Ocurrió un error al cargar la base de datos. Verifica tu conexión.
            </div>
        `;
    }
}

// 5. Ejecutar la función principal al abrir la página (muestra todos)
obtenerComercios("Todos");

// 6. Darle vida a los botones del menú desplegable (Filtros)
<comment-tag id="1">document.addEventListener('DOMContentLoaded', () => {
    const botonesFiltro = document.querySelectorAll('.enlace-filtro');
    
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            evento.preventDefault(); 
            
            // CORRECCIÓN AQUÍ: Tomamos el atributo directamente del botón, no del "target" del clic. 
            // Así ignoramos si el usuario le dio clic al emoji o al texto.
            const categoriaSeleccionada = boton.getAttribute('data-categoria');
            
            // Llamamos a la función
            obtenerComercios(categoriaSeleccionada);
            
            // Ocultar el menú móvil si estaba abierto
            const mobileMenu = document.getElementById('mobile-menu');
            if(mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
});</comment-tag id="1" text="Elimina la envoltura 'document.addEventListener('DOMContentLoaded', ...)' de este bloque.

Al usar 'type=\"module\"' en el HTML, el archivo se carga de forma diferida. Esto significa que cuando este código se ejecuta, el evento de carga ya pasó, provocando que los botones nunca reciban la instrucción del clic.

Solución: Deja el código suelto, de esta manera:

const botonesFiltro = document.querySelectorAll('.enlace-filtro');
botonesFiltro.forEach(boton => {
    // ...resto del código igual...
});" type="suggestion">
