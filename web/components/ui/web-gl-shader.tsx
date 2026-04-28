"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Uniforms = {
  resolution: { value: [number, number] };
  time: { value: number };
  xScale: { value: number };
  yScale: { value: number };
  distortion: { value: number };
};

type SceneRefs = {
  scene: THREE.Scene | null;
  camera: THREE.OrthographicCamera | null;
  renderer: THREE.WebGLRenderer | null;
  mesh: THREE.Mesh | null;
  uniforms: Uniforms | null;
  animationId: number | null;
  resizeObserver: ResizeObserver | null;
};

export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<SceneRefs>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
    resizeObserver: null,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const refs = sceneRef.current;

    if (!container) return;

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        float d = length(p) * distortion;

        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      refs.renderer.setSize(width, height, false);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.uniforms.resolution.value = [width, height];
    };

    refs.scene = new THREE.Scene();
    refs.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    refs.renderer.setClearColor(new THREE.Color(0x000000), 1);
    refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

    refs.uniforms = {
      resolution: { value: [container.clientWidth, container.clientHeight] },
      time: { value: 0.0 },
      xScale: { value: 1.0 },
      yScale: { value: 0.5 },
      distortion: { value: 0.05 },
    };

    const position = [
      -1.0, -1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0,  1.0, 0.0,
    ];

    const positions = new THREE.BufferAttribute(new Float32Array(position), 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", positions);

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: refs.uniforms,
      side: THREE.DoubleSide,
    });

    refs.mesh = new THREE.Mesh(geometry, material);
    refs.scene.add(refs.mesh);

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.01;
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
      refs.animationId = window.requestAnimationFrame(animate);
    };

    handleResize();
    animate();

    refs.resizeObserver = new ResizeObserver(handleResize);
    refs.resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      if (refs.animationId) window.cancelAnimationFrame(refs.animationId);
      window.removeEventListener("resize", handleResize);
      refs.resizeObserver?.disconnect();
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh);
        refs.mesh.geometry.dispose();
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose();
        }
      }
      refs.renderer?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />;
}
