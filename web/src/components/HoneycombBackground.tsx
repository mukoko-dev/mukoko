import { useEffect, useRef, useState } from "preact/hooks";
import * as THREE from "three";

const COLORS = {
  light: {
    primary: "#4B0082",   // Tanzanite
    secondary: "#0047AB", // Cobalt
    background: "#ffffff",
  },
  dark: {
    primary: "#B388FF",   // Tanzanite
    secondary: "#00B0FF", // Cobalt
    background: "#0f0e17",
  },
};

interface HoneycombBackgroundProps {
  intensity?: number;
  speed?: number;
}

function useTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return theme;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function HoneycombBackground({
  intensity = 0.18,
  speed = 0.3,
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

    const colors = COLORS[theme];
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

    // Pulsating honeycomb shader
    const fragmentShader = `
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uPrimaryColor;
      uniform vec3 uSecondaryColor;
      uniform vec3 uBgColor;
      uniform vec2 uResolution;

      varying vec2 vUv;

      // Hex grid math — returns (cell center, distance to nearest edge)
      // Uses two offset rows to tile hexagons
      vec4 hexCoord(vec2 uv) {
        vec2 r = vec2(1.0, 1.7320508); // 1, sqrt(3)
        vec2 h = r * 0.5;

        vec2 a = mod(uv, r) - h;
        vec2 b = mod(uv - h, r) - h;

        // Pick whichever hex center is closer
        vec2 gv = dot(a, a) < dot(b, b) ? a : b;

        // Hex edge distance (6-fold symmetry)
        vec2 absGv = abs(gv);
        float edgeDist = max(
          dot(absGv, normalize(vec2(1.0, 1.7320508))),
          absGv.x
        );

        // Cell ID for per-cell variation
        vec2 id = uv - gv;

        return vec4(gv, id);
      }

      float hexEdge(vec2 gv, float width) {
        vec2 absGv = abs(gv);
        float d = max(
          dot(absGv, normalize(vec2(1.0, 1.7320508))),
          absGv.x
        );
        float halfSize = 0.5;
        return smoothstep(halfSize, halfSize - width, d);
      }

      void main() {
        vec2 uv = vUv;
        float aspectRatio = uResolution.x / uResolution.y;
        uv.x *= aspectRatio;

        float t = uTime * 0.15;

        // Scale the hex grid
        float scale = 8.0;
        vec2 hexUv = uv * scale;

        vec4 hc = hexCoord(hexUv);
        vec2 gv = hc.xy; // Local coords within cell
        vec2 id = hc.zw; // Cell ID

        // Hex cell fill (interior)
        float fill = hexEdge(gv, 0.06);

        // Hex edge line (border of each cell)
        float innerFill = hexEdge(gv, 0.12);
        float edge = innerFill - fill;

        // Pulsation: ripple outward from center of viewport
        float distFromCenter = length(id / scale - vec2(aspectRatio * 0.5, 0.5));
        float pulse = sin(distFromCenter * 3.0 - t * 2.0) * 0.5 + 0.5;

        // Secondary slower pulse wave
        float pulse2 = sin(distFromCenter * 1.5 + t * 1.2) * 0.5 + 0.5;

        // Per-cell variation based on ID
        float cellHash = fract(sin(dot(id, vec2(127.1, 311.7))) * 43758.5453);
        float cellPulse = sin(t * 1.5 + cellHash * 6.2831) * 0.5 + 0.5;

        // Combine pulses for organic feel
        float combinedPulse = mix(pulse, cellPulse, 0.3) * mix(1.0, pulse2, 0.2);

        // Edge glow — Tanzanite on edges, pulsating
        float edgeGlow = edge * combinedPulse * 0.8;

        // Cell fill — very subtle Cobalt wash, breathing
        float cellFill = fill * combinedPulse * 0.15;

        // Compose final color
        vec3 color = uBgColor;
        color = mix(color, uSecondaryColor, cellFill * uIntensity);
        color = mix(color, uPrimaryColor, edgeGlow * uIntensity);

        // Subtle radial vignette — brighter near center
        float vignette = 1.0 - smoothstep(0.3, 1.2, distFromCenter);
        color = mix(uBgColor, color, 0.5 + vignette * 0.5);

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

  // Static fallback for reduced motion
  if (prefersReducedMotion) {
    const colors = COLORS[theme];
    return (
      <div
        class="honeycomb-bg"
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

  return <div ref={containerRef} class="honeycomb-bg" aria-hidden="true" />;
}
