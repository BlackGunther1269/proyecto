document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos HTML por su ID o clase
    const ageElement = document.getElementById('age');
    const recipientNameElement = document.getElementById('recipient-name');
    const giftBox = document.getElementById('giftBox');
    const messageModal = document.getElementById('messageModal');
    const closeButton = document.querySelector('.close-button');
    const heartsContainer = document.querySelector('.hearts-container');
    const bearImage = document.querySelector('.bear-image');

    // --- Configuración inicial de nombre y edad ---
    const defaultRecipientName = "Maria Fernanda";
    const defaultAge = 21;
    if (recipientNameElement) {
        recipientNameElement.textContent = defaultRecipientName;
    }
    if (ageElement) {
        ageElement.textContent = defaultAge;
    }

    // --- Funcionalidad de la caja de regalo y el modal ---
    if (giftBox) {
        giftBox.addEventListener('click', () => {
            if (messageModal) {
                messageModal.style.display = 'flex'; // Muestra el modal
            } else {
                console.error("No se encontró el elemento messageModal.");
            }
        });
    } else {
        console.error("No se encontró el elemento giftBox con ID 'giftBox'.");
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (messageModal) {
                messageModal.style.display = 'none'; // Oculta el modal
            }
        });
    } else {
        console.error("No se encontró el elemento closeButton.");
    }

    // Cierra el modal si se hace clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        if (event.target === messageModal) {
            messageModal.style.display = 'none';
        }
    });

    // --- Lógica para los corazones infinitos ---

    /**
     * Crea un corazón y lo anima para que flote y se desvanezca.
     */
    function createAndAnimateHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        let startX = 0;
        let startY = 0;

        // Calcula la posición inicial del corazón desde el osito
        if (bearImage && bearImage.complete && bearImage.naturalWidth !== 0) {
            const bearRect = bearImage.getBoundingClientRect();
            const heartsContainerRect = heartsContainer.getBoundingClientRect();

            // Calcula el centro del osito relativo al contenedor de corazones
            startX = (bearRect.left + bearRect.width / 2) - heartsContainerRect.left;
            startY = (bearRect.top + bearRect.height / 2) - heartsContainerRect.top;

            // Ajusta la posición para que parezca que salen de la boca/pecho del osito
            startX += 40; // Mueve significativamente a la derecha
            startY -= 10; // Ajuste vertical, puede necesitar más o menos dependiendo de la imagen
        } else if (heartsContainer) {
            // Fallback: Si la imagen del osito no carga, usa una posición predeterminada
            startX = heartsContainer.offsetWidth * 0.15 + 80; // Ajustado para el fallback también
            startY = heartsContainer.offsetHeight * 0.5 - 10; // Ajustado para el fallback también
            console.warn("La imagen del osito no está cargada o no se encontró. Usando posición de fallback para los corazones.");
        } else {
            console.error("No se encontró heartsContainer para posicionar el corazón.");
            return; // No se puede disparar el corazón sin un contenedor
        }
        
        // Establece la posición inicial del corazón
        heart.style.left = `${startX}px`;
        heart.style.top = `${startY}px`;
        
        // Define el destino aleatorio del corazón para movimiento horizontal a la derecha
        const targetX = startX + (Math.random() * 300 + 200); // Se mueve significativamente a la derecha (entre 200px y 500px)
        const targetY = startY + (Math.random() - 0.5) * 100; // Se mantiene relativamente horizontal, con pequeña variación vertical
        
        // Define el tamaño aleatorio del corazón
        const heartSize = Math.random() * 20 + 10; // Tamaño entre 10px y 30px
        heart.style.width = `${heartSize}px`;
        heart.style.height = `${heartSize}px`;
        
        heartsContainer.appendChild(heart);

        // Forzar un reflow para asegurar que las propiedades iniciales se apliquen antes de la transición
        void heart.offsetWidth;

        // Aplica la animación con un pequeño retraso para asegurar que el reflow ocurra
        setTimeout(() => {
            heart.style.transform = `translate(${targetX - startX}px, ${targetY - startY}px)`;
            heart.style.opacity = 0; // Se desvanece
        }, 10);
        
        // Elimina el corazón del DOM después de que la animación termine
        // La duración de la transición en CSS es de 2 segundos.
        setTimeout(() => {
            heart.remove();
        }, 2000);
    }

    // Inicia la creación de corazones de forma infinita a intervalos regulares
    setInterval(createAndAnimateHeart, 200); // Crea un nuevo corazón cada 200 milisegundos
});
