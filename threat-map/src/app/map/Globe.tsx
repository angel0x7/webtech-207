"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-expect-error three-globe types not provided by DefinitelyTyped
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface GeoData {
  latitude: number | null;
  longitude: number | null;
  country_name?: string | null;
}

interface Host {
  remote_host: string;
  count?: string | number;
  last_seen?: string;
  geo?: GeoData | null;
}

export default function Globe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- external lib not typed
  const globeObjRef = useRef<any>(null);
  const [hosts, setHosts] = useState<Host[]>([]);


  useEffect(() => {
    async function fetchHosts() {
      try {
        const res = await fetch("/api/geolocation/any", { cache: "no-store" });
        if (!res.ok) throw new Error("Erreur de récupération API");
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
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0); 
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.target.set(0, 0, 0);
      controls.update();

      const globe = new ThreeGlobe()
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
        .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
        .showAtmosphere(true)
        .atmosphereColor("#3a9ad9");

      scene.add(globe);

      const ambient = new THREE.AmbientLight(0xbbbbbb, 0.8);
      scene.add(ambient);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(5, 3, 5);
      scene.add(dirLight);

      globeObjRef.current = globe;

      const animate = () => {
        globe.rotation.y += 0.002;
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();

      const handleResize = () => {
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
    if (!globe || !hosts.length) return;

    const points = hosts
      .filter((h) => h.geo?.latitude && h.geo?.longitude)
      .map((h) => ({
        lat: h.geo!.latitude!,
        lng: h.geo!.longitude!,
        size: 0.06,
        color: "#FF003C", 
        ip: h.remote_host,
        country: h.geo?.country_name ?? "Unknown",
      }));

    globe.pointsData(points);
    globe.pointAltitude("size");
    globe.pointColor("color");
  }, [hosts]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 z-0" />
    </div>
  );
}
