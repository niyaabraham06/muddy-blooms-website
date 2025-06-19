document.addEventListener('DOMContentLoaded', function() {
    // --- Existing Hamburger Menu Functionality ---
    const hamburger = document.querySelector('.hamburger-menu');
    const body = document.body;

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            body.classList.toggle('menu-open');
        });
    }

    // --- Hero Background Slider Functionality (for index.html) ---
    // This part runs ONLY on index.html due to the element selectors
    const heroSliderSection = document.querySelector('.hero-section');
    const heroBackgroundSliderDiv = document.querySelector('.hero-background-slider');

    if (heroSliderSection && heroBackgroundSliderDiv) {
        // Ensure this path is correct for your background slider images
        const images = [
            'images/background sliders/background-1.jpg',
            'images/background sliders/background-2.jpg',
            'images/background sliders/background-3.jpg',
            'images/background sliders/background-4.jpg',
            'images/background sliders/background-5.jpg',
            'images/background sliders/background-6.jpg',
            'images/background sliders/background-7.jpg',
            'images/background sliders/background-8.jpg',
            'images/background sliders/background-9.jpg',
            'images/background sliders/background-10.jpg',
            'images/background sliders/background-11.jpg',
            'images/background sliders/background-12.jpg'
        ];

        let currentImageIndex = 0;

        function changeBackground() {
            const currentActiveDiv = heroSliderSection.querySelector('.hero-background-slider.active');
            currentImageIndex = (currentImageIndex + 1) % images.length;

            const nextImageDiv = document.createElement('div');
            nextImageDiv.classList.add('hero-background-slider');
            nextImageDiv.style.backgroundImage = `url('${images[currentImageIndex]}')`;

            const heroContent = heroSliderSection.querySelector('.hero-content');
            heroSliderSection.insertBefore(nextImageDiv, heroContent);

            void nextImageDiv.offsetWidth; // Trigger reflow to ensure CSS transition takes effect

            nextImageDiv.classList.add('active');

            if (currentActiveDiv) {
                currentActiveDiv.classList.remove('active');
                currentActiveDiv.addEventListener('transitionend', function handler() {
                    currentActiveDiv.removeEventListener('transitionend', handler);
                    currentActiveDiv.remove();
                }, { once: true });
            }
        }

        // Initial load of the first image for the main hero slider
        heroBackgroundSliderDiv.style.backgroundImage = `url('${images[currentImageIndex]}')`;
        heroBackgroundSliderDiv.classList.add('active');
        currentImageIndex = (currentImageIndex + 1) % images.length;

        setInterval(changeBackground, 7000); // Change background every 7 seconds
    }


    // --- Three.js 3D Background Animation for About Us page ---
    function initAboutHero3D() {
        const canvas = document.getElementById('aboutHeroCanvas');
        // Ensure canvas element and its parent (.page-hero) exist
        const container = canvas ? canvas.parentElement : null;

        // If canvas element or its container not found, exit the function to prevent errors
        if (!canvas || !container || typeof THREE === 'undefined') { // Added check for THREE to ensure Three.js is loaded
            console.warn("About Hero Canvas or its container not found, or Three.js not loaded. Skipping 3D init.");
            return;
        }

        // 1. Scene setup
        const scene = new THREE.Scene();
        // You can set a subtle dark background if the CSS overlay isn't enough to subdue the shapes
        // scene.background = new THREE.Color(0x0a0a0a); 

        // 2. Camera setup
        const camera = new THREE.PerspectiveCamera(
            75, // Field of view
            container.clientWidth / container.clientHeight, // Aspect ratio
            0.1, // Near clipping plane
            1000 // Far clipping plane
        );
        camera.position.z = 5; // Move camera back to see objects

        // 3. Renderer setup
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true, // Crucial: Allows transparency for the CSS overlay to work
            antialias: true // Smoother edges
        });
        renderer.setPixelRatio(window.devicePixelRatio); // Use device pixel ratio for sharp rendering
        renderer.setSize(container.clientWidth, container.clientHeight);

        // 4. Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft overall light, increased intensity
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Direct light source
        directionalLight.position.set(5, 5, 5); // Position of the light
        scene.add(directionalLight);

        // 5. Objects (Abstract Green Shapes)
        // Using various geometries for variety
        const geometries = [
            new THREE.SphereGeometry(1, 32, 32), // Sphere
            new THREE.OctahedronGeometry(1.2, 0), // Octahedron
            new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16), // Torus Knot
            new THREE.DodecahedronGeometry(1, 0), // Dodecahedron
            new THREE.ConeGeometry(1, 2, 32) // Cone
        ];

        // Using different shades of green from your palette
        const materials = [
            new THREE.MeshPhongMaterial({ color: 0x006400, shininess: 50, transparent: true, opacity: 0.8 }), // primary-green
            new THREE.MeshPhongMaterial({ color: 0x2e8b57, shininess: 50, transparent: true, opacity: 0.7 }), // secondary-color
            new THREE.MeshPhongMaterial({ color: 0x004d00, shininess: 50, transparent: true, opacity: 0.6 })  // primary-green-dark
        ];

        const objects = []; // Array to hold all animated objects
        for (let i = 0; i < 15; i++) { // Create more objects for a denser effect
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);

            // Random positions within a visible range
            mesh.position.x = (Math.random() - 0.5) * 25; // Wider horizontal spread
            mesh.position.y = (Math.random() - 0.5) * 25; // Wider vertical spread
            mesh.position.z = (Math.random() - 0.5) * 10 - 5; // Z-depth for perspective

            // Random initial rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;

            // Random scale for variety in size
            const scale = Math.random() * 0.7 + 0.3; // Scale between 0.3 and 1
            mesh.scale.set(scale, scale, scale);

            objects.push(mesh);
            scene.add(mesh);
        }

        // 6. Animation loop (runs continuously)
        const animate = function () {
            requestAnimationFrame(animate);

            // Animate objects subtly
            objects.forEach((obj, index) => {
                // Adjust rotation speeds for variety
                obj.rotation.x += 0.0005 + (index * 0.00001);
                obj.rotation.y += 0.0003 + (index * 0.000005);

                // Subtle floating motion using sine and cosine waves
                obj.position.y += Math.sin(Date.now() * 0.0001 + index) * 0.005;
                obj.position.x += Math.cos(Date.now() * 0.00015 + index) * 0.003;

                // Make objects drift towards the camera then reset, creating a continuous flow
                obj.position.z += 0.01; // Move towards camera
                if (obj.position.z > camera.position.z + 5) { // If it goes too far past camera
                    obj.position.z = -15; // Reset it to the back
                }
            });

            renderer.render(scene, camera);
        };

        // 7. Handle Window Resizing (Crucial for responsiveness)
        function onWindowResize() {
            // Only resize if the canvas is actually visible and part of the DOM
            if (canvas.offsetParent !== null) { // Check if element is rendered (visible)
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        }
        window.addEventListener('resize', onWindowResize);

        // Start the animation loop
        animate();
    }

    // Initialize the Three.js background only if the canvas element exists on the page
    // This makes the script robust, it won't try to run 3D on pages without the canvas
    if (document.getElementById('aboutHeroCanvas')) {
        // Calling directly as canvas is in HTML, not dynamically added, so it's available after DOMContentLoaded
        initAboutHero3D();
    }
});
