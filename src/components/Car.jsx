import { forwardRef, useRef, useMemo, useEffect } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useCarControls } from "../hooks/useCarControls";
import { useGLTF } from "@react-three/drei";

const Car = forwardRef(({ url = "/models/car.glb", scale = 1 }, ref) => {
  // — Model
  const { scene } = useGLTF(url);
  const model = useMemo(() => scene.clone(), [scene]);

  // — Controls & movement
  const keys = useCarControls();
  const velocity = useRef(0);
  const maxSpeed = 20;
  const accelRate = 8;
  const tmpVec = useRef(new THREE.Vector3()).current;

  // — Audio: idle + engine loops
  const { camera } = useThree();
  const idleRef = useRef();
  const engineRef = useRef();
  const idleBuffer = useLoader(THREE.AudioLoader, "/audio/idle.wav");
  const engineBuffer = useLoader(THREE.AudioLoader, "/audio/engine.wav");

  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // resume context on first interaction
    const resume = () => {
      if (listener.context.state === "suspended") listener.context.resume();
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
    window.addEventListener("pointerdown", resume);
    window.addEventListener("keydown", resume);

    // idle loop: low constant volume
    const idleSound = new THREE.PositionalAudio(listener);
    idleSound.setBuffer(idleBuffer);
    idleSound.setLoop(true);
    idleSound.setRefDistance(5);
    idleSound.setVolume(0.3); // constant
    idleSound.play();
    ref.current.add(idleSound);
    idleRef.current = idleSound;

    // engine loop: silent until throttle > threshold
    const engineSound = new THREE.PositionalAudio(listener);
    engineSound.setBuffer(engineBuffer);
    engineSound.setLoop(true);
    engineSound.setRefDistance(5);
    engineSound.setVolume(0); // start silent
    engineSound.play();
    ref.current.add(engineSound);
    engineRef.current = engineSound;

    return () => {
      camera.remove(listener);
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, [camera, idleBuffer, engineBuffer, ref]);

  useFrame((_, delta) => {
    // 1) throttle target
    let target = 0;
    if (keys.up) target = maxSpeed;
    if (keys.down) target = -maxSpeed;

    // 2) smooth velocity
    velocity.current = THREE.MathUtils.lerp(
      velocity.current,
      target,
      accelRate * delta
    );

    // 3) throttle fraction
    const tRaw = Math.abs(velocity.current) / maxSpeed;
    const threshold = 0.1;
    const t = tRaw < threshold ? 0 : (tRaw - threshold) / (1 - threshold);

    // engine volume & pitch
    if (engineRef.current) {
      engineRef.current.setVolume(THREE.MathUtils.lerp(0, 1.0, t));
      engineRef.current.playbackRate = THREE.MathUtils.lerp(1.0, 1.4, t);
    }

    // 4) steering
    if (Math.abs(velocity.current) > 0.5) {
      const dir = Math.sign(velocity.current);
      if (keys.left) ref.current.rotation.y += Math.PI * delta * dir;
      if (keys.right) ref.current.rotation.y -= Math.PI * delta * dir;
    }

    // 5) move
    ref.current.getWorldDirection(tmpVec);
    tmpVec.normalize();
    ref.current.position.addScaledVector(tmpVec, velocity.current * delta);
  });

  return (
    <primitive
      ref={ref}
      object={model}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
});

useGLTF.preload("/models/car.glb");
export default Car;
