"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function getColors(): { primary: string; secondary: string; background: string } {
  const style = getComputedStyle(document.documentElement);
  return {
    primary: style.getPropertyValue("--color-tanzanite").trim() || "#B388FF",
    secondary: style.getPropertyValue("--color-cobalt").trim() || "#0047AB",
    background: style.getPropertyValue("--color-bg").trim() || "#FAF9F5",
  };
}

interface HoneycombBackgroundProps {
  intensity?: number;
  speed?: number;
}

function useTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mq.matches ? "dark" : "light");
    const handler = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return theme;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function HoneycombBackground({
  intensity = 0.5,
  speed = 0.6,
}: HoneycombBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number>(0);
  const theme = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const colors = getColors();
    const primaryColor = new THREE.Color(colors.primary);
    const secondaryColor = new THREE.Color(colors.secondary);
    const bgColor = new THREE.Color(colors.background);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uPrimaryColor;
      uniform vec3 uSecondaryColor;
      uniform vec3 uBgColor;
      uniform vec2 uResolution;

      varying vec2 vUv;

      vec4 hexCoord(vec2 uv) {
        vec2 r = vec2(1.0, 1.7320508);
        vec2 h = r * 0.5;
        vec2 a = mod(uv, r) - h;
        vec2 b = mod(uv - h, r) - h;
        vec2 gv = dot(a, a) < dot(b, b) ? a : b;
        vec2 id = uv - gv;
        return vec4(gv, id);
      }

      float hexEdge(vec2 gv, float w) {
        vec2 ag = abs(gv);
        float d = max(dot(ag, normalize(vec2(1.0, 1.7320508))), ag.x);
        return smoothstep(0.5, 0.5 - w, d);
      }

      void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        uv.x *= aspect;

        float t = uTime;
        float scale = 6.0;
        vec4 hc = hexCoord(uv * scale);
        vec2 gv = hc.xy;
        vec2 id = hc.zw;

        float fill = hexEdge(gv, 0.08);
        float innerFill = hexEdge(gv, 0.18);
        float edge = innerFill - fill;

        float distFromCenter = length(id / scale - vec2(aspect * 0.5, 0.5));
        float pulse = sin(distFromCenter * 4.0 - t * 3.0) * 0.5 + 0.5;
        pulse = pulse * pulse;

        float pulse2 = sin(distFromCenter * 2.0 + t * 1.8) * 0.5 + 0.5;

        float cellHash = fract(sin(dot(id, vec2(127.1, 311.7))) * 43758.5453);
        float cellPulse = sin(t * 2.0 + cellHash * 6.2831) * 0.5 + 0.5;

        float combined = mix(pulse, cellPulse, 0.25);
        combined = combined * (0.6 + pulse2 * 0.4);

        float edgeGlow = edge * (0.3 + combined * 0.7);
        float cellFill = fill * combined * 0.35;

        vec3 color = uBgColor;
        color = mix(color, uSecondaryColor, cellFill * uIntensity);
        color = mix(color, uPrimaryColor, edgeGlow * uIntensity);

        float vignette = 1.0 - smoothstep(0.5, 1.8, distFromCenter);
        color = mix(uBgColor, color, 0.7 + vignette * 0.3);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: intensity },
        uPrimaryColor: { value: primaryColor },
        uSecondaryColor: { value: secondaryColor },
        uBgColor: { value: bgColor },
        uResolution: { value: new THREE.Vector2(width, height) },
      },
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const uTime = material.uniforms["uTime"]!;
    const uResolution = material.uniforms["uResolution"]!;

    const startTime = Date.now();
    const animate = () => {
      uTime.value = ((Date.now() - startTime) / 1000) * speed;
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      (uResolution.value as THREE.Vector2).set(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme, intensity, speed, prefersReducedMotion]);

  if (prefersReducedMotion) {
    const colors = getColors();
    return (
      <div
        className="honeycomb-bg"
        style={{
          background:
            theme === "dark"
              ? `radial-gradient(ellipse at 30% 70%, ${colors.primary}12 0%, transparent 50%), ${colors.background}`
              : `radial-gradient(ellipse at 30% 70%, ${colors.primary}08 0%, transparent 50%), ${colors.background}`,
        }}
        aria-hidden="true"
      />
    );
  }

  return <div ref={containerRef} className="honeycomb-bg" aria-hidden="true" />;
}
