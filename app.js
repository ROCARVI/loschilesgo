// 1. Importar las funciones de Firebase (Usando versiones estables recientes)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

// Variable maestra para evitar múltiples lecturas a Firebase
let todosLosComercios = [];

// 4. Descargar los datos desde Firebase
async function cargarComercios() {
    try {
        const comerciosRef = collection(db, "comercios");
        const querySnapshot = await getDocs(comerciosRef);
        
        todosLosComercios = []; // Vaciamos para evitar duplicados
        
        querySnapshot.forEach((doc) => {
            todosLosComercios.push(doc.data());
        });

        // Mostrar todas las tarjetas por defecto
        renderizarTarjetas(todosLosComercios);
        
    } catch (error) {
        console.error("Error al obtener los lugares: ", error);
        const contenedor = document.getElementById("lista-comercios");
        if(contenedor) {
            contenedor.innerHTML = `
                <div class="col-span-full py-10 text-center text-red-500 bg-red-50 rounded-xl">
                    Ocurrió un error al cargar los comercios. Por favor, recarga la página.
                </div>
            `;
        }
    }
}

// 5. Dibujar las tarjetas (Conserva tu nuevo diseño exactamente)
function renderizarTarjetas(lista) {
    const contenedor = document.getElementById("lista-comercios");
    if (!contenedor) return; 
    
    contenedor.innerHTML = ""; 

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <div class="col-span-full py-16 flex flex-col items-center text-center">
                <div class="bg-gray-100 p-6 rounded-full mb-4">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-700">No hay comercios en esta categoría</h3>
                <p class="text-gray-500 mt-2">Prueba seleccionando otro filtro.</p>
            </div>
        `;
        return;
    }
    
    lista.forEach((negocio) => {
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
}

// 6. Activar la interactividad de los botones de filtro
document.addEventListener("DOMContentLoaded", () => {
    const botonesFiltro = document.querySelectorAll(".btn-filtro");

    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", (evento) => {
            // A. Apagar todos los botones (volverlos blancos con borde gris)
            botonesFiltro.forEach(b => {
                b.classList.remove("bg-lc-green", "text-white", "border-lc-green");
                b.classList.add("bg-white", "text-gray-600", "border-gray-200");
            });
            
            // B. Encender el botón tocado (volverlo verde)
            const botonActivo = evento.currentTarget;
            botonActivo.classList.remove("bg-white", "text-gray-600", "border-gray-200");
            botonActivo.classList.add("bg-lc-green", "text-white", "border-lc-green");

            // C. Filtrar la lista
            const categoriaBuscada = botonActivo.getAttribute("data-categoria");
            
            if (categoriaBuscada === "Todos") {
                renderizarTarjetas(todosLosComercios);
            } else {
                const filtrados = todosLosComercios.filter(negocio => negocio.categoria === categoriaBuscada);
                renderizarTarjetas(filtrados);
            }
        });
    });
});

// 7. Arrancar la aplicación
cargarComercios();
