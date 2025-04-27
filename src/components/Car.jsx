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

  // create pivot objects for front wheels and gather rear wheels
  const { frontPivots, rearWheels } = useMemo(() => {
    const frontNames = ["Object_88", "Object_89", "Object_11", "Object_12"];
    const rearNames = ["Object_117", "Object_118", "Object_8", "Object_9"];
    const fronts = [];
    const rears = [];

    // setup front wheel pivots
    frontNames.forEach((name) => {
      const wheel = model.getObjectByName(name);
      if (!wheel) return;
      const parent = wheel.parent;
      // create pivot at wheel position
      const pivot = new THREE.Object3D();
      parent.add(pivot);
      pivot.position.copy(wheel.position);
      pivot.rotation.set(0, 0, 0);
      pivot.scale.set(1, 1, 1);
      // re-parent wheel under pivot
      wheel.position.set(0, 0, 0);
      parent.remove(wheel);
      pivot.add(wheel);
      fronts.push(pivot);
    });

    // gather rear wheels directly
    rearNames.forEach((name) => {
      const wheel = model.getObjectByName(name);
      if (wheel) rears.push(wheel);
    });

    return { frontPivots: fronts, rearWheels: rears };
  }, [model]);

  // input & motion state
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

  // drive & animate
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

    // spin all wheels around their local X
    const spin = (velocity.current * delta) / 0.4;
    frontPivots.forEach((p) => p.children[0].rotateX(spin));
    rearWheels.forEach((w) => w.rotateX(spin));

    // steer front wheels: rotate pivots, not meshes
    const steerSign = keys.left ? 1 : keys.right ? -1 : 0;
    const maxSteer = Math.PI / 6;
    const steerAngle = steerSign * maxSteer;
    frontPivots.forEach((p) => (p.rotation.y = steerAngle));

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
