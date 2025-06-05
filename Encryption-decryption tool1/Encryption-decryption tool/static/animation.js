class EncryptionAnimation {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        document.getElementById('animation-container').appendChild(this.renderer.domElement);

        // Create key model
        const keyGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
        const keyMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff88,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        this.key = new THREE.Mesh(keyGeometry, keyMaterial);

        // Add lights
        const light1 = new THREE.PointLight(0x00ff88, 1, 100);
        light1.position.set(5, 5, 5);
        const light2 = new THREE.PointLight(0xff3366, 1, 100);
        light2.position.set(-5, -5, -5);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

        this.scene.add(this.key);
        this.scene.add(light1);
        this.scene.add(light2);
        this.scene.add(ambientLight);

        this.camera.position.z = 5;

        this.animate();
        this.handleResize();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.key.rotation.x += 0.01;
        this.key.rotation.y += 0.01;

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }
}

const animation = new EncryptionAnimation();