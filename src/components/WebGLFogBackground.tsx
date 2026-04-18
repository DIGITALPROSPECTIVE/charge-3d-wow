import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const debounce = (callback: (...args: any[]) => void, duration: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => callback.apply(this, args), duration);
  };
};

class Fog {
  uniforms: { time: { type: string; value: number }; tex: { type: string; value: THREE.Texture | null } };
  num: number;
  obj: THREE.Mesh | null;

  constructor() {
    this.uniforms = {
      time: { type: 'f', value: 0 },
      tex: { type: 't', value: null },
    };
    this.num = 200;
    this.obj = null;
  }

  createObj(tex: THREE.Texture) {
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneGeometry(1100, 1100, 20, 20);

    geometry.setAttribute('position', baseGeometry.attributes.position);
    geometry.setAttribute('normal', baseGeometry.attributes.normal);
    geometry.setAttribute('uv', baseGeometry.attributes.uv);
    geometry.setIndex(baseGeometry.index);

    const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3);
    const delays = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1);
    const rotates = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1);

    for (let i = 0; i < this.num; i++) {
      instancePositions.setXYZ(i, (Math.random() * 2 - 1) * 850, 0, (Math.random() * 2 - 1) * 300);
      delays.setX(i, Math.random());
      rotates.setX(i, Math.random() * 2 + 1);
    }

    geometry.setAttribute('instancePosition', instancePositions);
    geometry.setAttribute('delay', delays);
    geometry.setAttribute('rotate', rotates);

    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        attribute vec3 position;
        attribute vec2 uv;
        attribute vec3 instancePosition;
        attribute float delay;
        attribute float rotate;

        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform float time;

        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vColor;
        varying float vBlink;

        const float duration = 200.0;

        mat4 calcRotateMat4Z(float radian) {
          return mat4(
            cos(radian), -sin(radian), 0.0, 0.0,
            sin(radian), cos(radian), 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
          );
        }
        vec3 convertHsvToRgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        void main(void) {
          float now = mod(time + delay * duration, duration) / duration;
          mat4 rotateMat = calcRotateMat4Z(radians(rotate * 360.0) + time * 0.1);
          vec3 rotatePosition = (rotateMat * vec4(position, 1.0)).xyz;
          vec3 moveRise = vec3(
            (now * 2.0 - 1.0) * (2500.0 - (delay * 2.0 - 1.0) * 2000.0),
            (now * 2.0 - 1.0) * 2000.0,
            sin(radians(time * 50.0 + delay + length(position))) * 30.0
          );
          vec3 updatePosition = instancePosition + moveRise + rotatePosition;
          vec3 hsv = vec3(time * 0.1 + delay * 0.2 + length(instancePosition) * 100.0, 0.5, 0.8);
          vec3 rgb = convertHsvToRgb(hsv);
          float blink = (sin(radians(now * 360.0 * 20.0)) + 1.0) * 0.88;
          vec4 mvPosition = modelViewMatrix * vec4(updatePosition, 1.0);
          vPosition = position;
          vUv = uv;
          vColor = rgb;
          vBlink = blink;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D tex;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vColor;
        varying float vBlink;

        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          vec4 texColor = texture2D(tex, vUv);
          vec3 color = (texColor.rgb - vBlink * length(p) * 0.8) * vColor;
          float opacity = texColor.a * 0.36;
          gl_FragColor = vec4(color, opacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.uniforms.tex.value = tex;
    this.obj = new THREE.Mesh(geometry, material);
  }

  render(time: number) {
    this.uniforms.time.value += time;
  }
}

export default function WebGLFogBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const clock = new THREE.Clock();
    const resolution = new THREE.Vector2();

    camera.far = 50000;
    camera.setFocalLength(24);

    const fog = new Fog();
    let animId: number;

    const render = () => {
      const time = clock.getDelta();
      fog.render(time);
      renderer.render(scene, camera);
    };

    const renderLoop = () => {
      render();
      animId = requestAnimationFrame(renderLoop);
    };

    const resizeWindow = () => {
      resolution.set(window.innerWidth, window.innerHeight);
      canvas.width = resolution.x;
      canvas.height = resolution.y;
      camera.aspect = resolution.x / resolution.y;
      camera.updateProjectionMatrix();
      renderer.setSize(resolution.x, resolution.y);
    };

    const texLoader = new THREE.TextureLoader();
    texLoader.crossOrigin = 'anonymous';
    texLoader.load(
      'https://ykob.github.io/sketch-threejs/img/sketch/fog/fog.png',
      (tex) => {
        fog.createObj(tex);
        if (fog.obj) scene.add(fog.obj);
        renderer.setClearColor(0x111111, 1.0);
        camera.position.set(0, 0, 1000);
        camera.lookAt(new THREE.Vector3());
        clock.start();
        resizeWindow();
        renderLoop();
      }
    );

    const onResize = debounce(resizeWindow, 200);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
