"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
type GeoData = {
    latitude: number | null;
    longitude: number | null;
    country_name?: string | null;
};

type Host = {
    remote_host: string;
    count?: string | number;
    last_seen?: string;
    geo?: GeoData | null;
};

export default function Globe({ hosts }: { hosts: Host[] }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const globeObjRef = useRef<any | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);



    useEffect(() => {
        let isMounted = true;

        async function initGlobe() {
            
            const { default: ThreeGlobe } = await import("three-globe");

            if (!isMounted || !containerRef.current) return;
            const container = containerRef.current;
            container.innerHTML = "";

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                45,
                container.clientWidth / container.clientHeight,
                0.1,
                2000
            );
            camera.position.set(0, 0, 300);
            camera.lookAt(0, 0, 0);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.08;
            controls.target.set(0, 0, 0);
            controls.update();

            globeObjRef.current = new ThreeGlobe();
            const globe = new (ThreeGlobe as any)()
                .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
                .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
                .showAtmosphere(true)
                .atmosphereColor("#3a9ad9");

            scene.add(globe);

            const ambient = new THREE.AmbientLight(0xbbbbbb, 0.8);
            scene.add(ambient);

            const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
            dirLight.position.set(5, 3, 5);
            scene.add(dirLight);

            const animate = () => {
                globe.rotation.y += 0.002;
                controls.update();
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            };
            animate();

            const handleResize = () => {
                if (!container) return;
                const width = container.clientWidth;
                const height = container.clientHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            };

            window.addEventListener("resize", handleResize);

            return () => {
                isMounted = false;
                window.removeEventListener("resize", handleResize);
                renderer.dispose();
                container.innerHTML = "";
            };
        }

        initGlobe();

        return () => {
            isMounted = false;
        };
    }, []);


    useEffect(() => {
        const globe = globeObjRef.current;
        if (!globe) return;

        const points = hosts
            .filter((h) => h.geo?.latitude != null && h.geo?.longitude != null)
            .map((h) => ({
                lat: h.geo!.latitude!,
                lng: h.geo!.longitude!,
                size: Math.min(1.6, Math.max(0.4, Number(h.count ?? 1) / 10)),
                color: "red",
                ip: h.remote_host,
                country: h.geo?.country_name ?? "Unknown",
            }));

        globe.pointsData(points).pointAltitude("size").pointColor("color");
    }, [hosts]);

    return (
        <div className="w-full min-h-screen flex items-center justify-center px-4">
            <div
                ref={containerRef}
                className="w-full max-w-5xl mx-auto h-[65vh] md:h-[600px] lg:h-[650px] bg-wight "
                style={{ minHeight: 1020 }}
            />
        </div>
    );

}
