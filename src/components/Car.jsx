import { forwardRef, useRef, useMemo, useEffect } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { AudioLoader } from "three";
import { useCarControls } from "../hooks/useCarControls";
import { useGLTF } from "@react-three/drei";

const Car = forwardRef(({ url = "/models/car.glb", scale = 1 }, ref) => {
  // load & clone model
  const { scene } = useGLTF(url);
  const model = useMemo(() => scene.clone(), [scene]);

  // collect wheel meshes
  const wheelNames = [
    "Object_88",
    "Object_89", // front-left
    "Object_11",
    "Object_12", // front-right
    "Object_117",
    "Object_118", // rear-left
    "Object_8",
    "Object_9", // rear-right
  ];
  const wheels = useMemo(
    () => wheelNames.map((name) => model.getObjectByName(name)).filter(Boolean),
    [model]
  );

  // input & movement state
  const keys = useCarControls();
  const velocity = useRef(0);
  const maxSpeed = 20;
  const accelRate = 8;
  const tmp = useRef(new THREE.Vector3()).current;

  // audio setup
  const { camera } = useThree();
  const idleBuf = useLoader(AudioLoader, "/audio/idle.wav");
  const engineBuf = useLoader(AudioLoader, "/audio/engine.wav");
  const audioRef = useRef({ idle: null, rev: null });

  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);
    // resume on interaction
    const resume = () =>
      listener.context.state === "suspended" && listener.context.resume();
    window.addEventListener("pointerdown", resume);
    window.addEventListener("keydown", resume);

    // idle sound
    const idleSound = new THREE.PositionalAudio(listener);
    idleSound.setBuffer(idleBuf);
    idleSound.setLoop(true);
    idleSound.setRefDistance(5);
    idleSound.setVolume(0.3);
    idleSound.play();
    ref.current.add(idleSound);

    // engine sound
    const revSound = new THREE.PositionalAudio(listener);
    revSound.setBuffer(engineBuf);
    revSound.setLoop(true);
    revSound.setRefDistance(5);
    revSound.setVolume(0);
    revSound.play();
    ref.current.add(revSound);

    audioRef.current = { idle: idleSound, rev: revSound };

    return () => {
      camera.remove(listener);
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, [camera, idleBuf, engineBuf, ref]);

  useFrame((_, delta) => {
    // update velocity
    let target = keys.up ? maxSpeed : keys.down ? -maxSpeed : 0;
    velocity.current = THREE.MathUtils.lerp(
      velocity.current,
      target,
      accelRate * delta
    );

    // move car
    ref.current.getWorldDirection(tmp);
    tmp.normalize();
    ref.current.position.addScaledVector(tmp, velocity.current * delta);

    // spin wheels
    const spinAngle = (velocity.current * delta) / 0.4;
    wheels.forEach((w) => {
      // rotate around each wheel's local X axis for consistent spinning
      w.rotateX(spinAngle);
    });

    // body steering
    if (Math.abs(velocity.current) > 0.5) {
      const dir = Math.sign(velocity.current);
      if (keys.left) ref.current.rotation.y += Math.PI * delta * dir;
      if (keys.right) ref.current.rotation.y -= Math.PI * delta * dir;
    }

    // audio crossfade
    const { idle, rev } = audioRef.current;
    if (idle && rev) {
      const t = Math.min(Math.abs(velocity.current) / maxSpeed, 1);
      idle.setVolume(THREE.MathUtils.lerp(0.3, 0.1, t));
      rev.setVolume(THREE.MathUtils.lerp(0, 1, t));
      rev.playbackRate = THREE.MathUtils.lerp(1, 1.4, t);
    }
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
