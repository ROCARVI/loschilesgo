// 1. Importar las funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
console.log("Firebase conectado y listo para dibujar comercios");

// 4. Función para leer datos y crear las tarjetas en la pantalla
async function obtenerComercios() {
    try {
        const comerciosRef = collection(db, "comercios");
        const querySnapshot = await getDocs(comerciosRef);
        
        // Conectar con el <div> del HTML que tiene el id "lista-comercios"
        const contenedor = document.getElementById("lista-comercios");
        
        // Limpiar el contenedor (esto borra la tarjeta falsa de "Cancha La Frontera")
        contenedor.innerHTML = "";

        // Si tu base de datos de Firebase aún está vacía, mostramos este aviso
        if (querySnapshot.empty) {
            contenedor.innerHTML = "<p class='text-gray-500 col-span-full text-center py-10'>Aún no hay comercios registrados en LosChilesGo. ¡Agrega el primero!</p>";
            return;
        }
        
        // Si hay datos, recorremos cada negocio y creamos su diseño
        querySnapshot.forEach((doc) => {
            const negocio = doc.data(); // Aquí viene la info de tu base de datos
            
            // Diseñamos la tarjeta inyectando el nombre y categoría reales
            const tarjetaHTML = `
                <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    <div class="h-32 bg-gray-200 flex items-center justify-center">
                        <span class="text-gray-500 text-sm">Foto de ${negocio.nombre || 'Lugar'}</span>
                    </div>
                    <div class="p-4">
                        <h3 class="font-bold text-xl mb-1">${negocio.nombre || 'Sin nombre'}</h3>
                        <p class="text-sm text-gray-600 mb-3">${negocio.categoria || 'General'}</p>
                        <div class="flex items-center text-yellow-500 mb-2">
                            ⭐⭐⭐⭐☆ <span class="text-gray-400 text-xs ml-2">(Nuevo)</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Agregamos la tarjeta terminada a la pantalla
            contenedor.innerHTML += tarjetaHTML;
        });
    } catch (error) {
        console.error("Error al obtener los lugares: ", error);
    }
}

// 5. Ejecutar todo al abrir la página
obtenerComercios();