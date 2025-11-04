"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-expect-error OrbitControls n’a pas de types dans three-globe
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

export default function Globe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeObjRef = useRef<any>(null);
  const [hosts, setHosts] = useState<Host[]>([]);


  useEffect(() => {
    async function fetchHosts() {
      try {
        const res = await fetch("/api/geolocation/any", { cache: "no-store" });
        if (!res.ok) throw new Error("Erreur de récupération");
        const data: Host[] = await res.json();
        setHosts(data);
      } catch (err) {
        console.error("Erreur API géolocalisation:", err);
      }
    }
    fetchHosts();
  }, []);


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

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;

      const globe = new ThreeGlobe()
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
        .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
        .showAtmosphere(true)
        .atmosphereColor("#3a9ad9");

      scene.add(globe);

      scene.add(new THREE.AmbientLight(0xbbbbbb, 0.8));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
      dirLight.position.set(5, 3, 5);
      scene.add(dirLight);

      globeObjRef.current = globe;

      const animate = () => {
        globe.rotation.y += 0.0015;
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();

      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", resize);

      return () => {
        isMounted = false;
        window.removeEventListener("resize", resize);
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
    if (!globe || !hosts.length) return;

    const points = hosts
      .filter((h) => h.geo?.latitude && h.geo?.longitude)
      .map((h) => ({
        lat: h.geo!.latitude!,
        lng: h.geo!.longitude!,
        size: 0.08, // plus grand = plus visible
        color: "#00FFE1", // fluo turquoise
        ip: h.remote_host,
        country: h.geo?.country_name ?? "Unknown",
      }));

    globe.pointsData(points);
    globe.pointAltitude("size");
    globe.pointColor("color");

  
 
  }, [hosts]);



  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        ref={containerRef}
        className="absolute inset-0 z-0"
      />

    </div>
  );
}
