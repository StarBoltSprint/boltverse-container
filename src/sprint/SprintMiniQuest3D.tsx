import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import type { ExperienceType } from "../data/mock";
import type { PlayResult } from "../data/playContent";
import { stormOrbQuest } from "../data/playContent";
import { savePlayResult } from "../data/playSession";

export interface SprintMiniQuest3DProps {
  experienceId: string;
  title: string;
  emoji: string;
  type: ExperienceType;
}

const TARGET_ORBS = stormOrbQuest.targetOrbs;
const DURATION = stormOrbQuest.seconds;
const FORWARD_SPEED = 22;
const LANE_LIMIT = 4.2;
const TRACK_SEGMENTS = 48;
const SEGMENT_LEN = 14;

type InputState = {
  left: boolean;
  right: boolean;
  jump: boolean;
};

/**
 * Three.js Sprint Mini-Quest — Stormgate-style high-speed run.
 * Collect Lightning Orbs, dodge obstacles, finish or race the timer.
 */
export function SprintMiniQuest3D({
  experienceId,
  title,
  emoji,
  type,
}: SprintMiniQuest3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [hud, setHud] = useState({ orbs: 0, timeLeft: DURATION, speed: 0, started: false });
  const [countdown, setCountdown] = useState(3);
  const finishedRef = useRef(false);
  const inputRef = useRef<InputState>({ left: false, right: false, jump: false });
  const statsRef = useRef({ orbs: 0, timeLeft: DURATION });

  const complete = useCallback(
    (orbs: number, reason: "goal" | "timeout") => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const ratio = orbs / TARGET_ORBS;
      const personal = Math.round(
        stormOrbQuest.baseResonance * Math.min(1.25, 0.35 + ratio)
      );
      const shared = Math.round(
        stormOrbQuest.sharedResonance * Math.min(1.2, 0.4 + ratio)
      );
      const result: PlayResult = {
        experienceId,
        title,
        type,
        emoji,
        personalResonance: personal,
        sharedResonance: shared,
        coreDelta: `+0.00${2 + (orbs % 5)}%`,
        rewards: stormOrbQuest.rewards,
        endingTitle:
          orbs >= TARGET_ORBS
            ? "Stormgate cleared!"
            : reason === "timeout"
              ? "Sprint ended — timer"
              : "Sprint complete",
        endingSummary:
          orbs >= TARGET_ORBS
            ? `You collected all ${TARGET_ORBS} Lightning Orbs at full Bolt velocity. The Core pulses with your Resonance.`
            : `You secured ${orbs}/${TARGET_ORBS} orbs. Sprint again to master the corridor.`,
      };
      savePlayResult(result);
      navigate(`/results/${experienceId}`, { replace: true, state: result });
    },
    [emoji, experienceId, navigate, title, type]
  );

  // Countdown then start
  useEffect(() => {
    if (countdown <= 0) return;
    const t = window.setTimeout(() => setCountdown((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth || 800;
    const h = el.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03060f);
    scene.fog = new THREE.FogExp2(0x06101f, 0.028);

    const camera = new THREE.PerspectiveCamera(62, w / h, 0.1, 220);
    camera.position.set(0, 5.5, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x4488aa, 0.45);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xaefcff, 1.15);
    key.position.set(6, 14, 4);
    key.castShadow = true;
    scene.add(key);
    const rim = new THREE.PointLight(0x22d3ee, 2.2, 40);
    rim.position.set(0, 4, -2);
    scene.add(rim);

    // Stars
    {
      const starGeo = new THREE.BufferGeometry();
      const starCount = 900;
      const positions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 120;
        positions[i * 3 + 1] = Math.random() * 50 - 5;
        positions[i * 3 + 2] = -Math.random() * 180;
      }
      starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const stars = new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0xaaf0ff, size: 0.08, transparent: true, opacity: 0.85 })
      );
      scene.add(stars);
    }

    // Bolt runner — faces −Z (down the track, away from camera at +Z)
    // Capsule default is along Y; rotate onto Z so body length follows the run.
    const bolt = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf2f6ff,
      roughness: 0.45,
      metalness: 0.15,
    });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.9, 6, 12), bodyMat);
    // Y-up capsule → length along Z (forward/back)
    body.rotation.x = Math.PI / 2;
    body.position.set(0, 0.65, 0);
    body.castShadow = true;
    bolt.add(body);
    // Head toward −Z (into the corridor)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), bodyMat);
    head.position.set(0, 0.85, -0.7);
    bolt.add(head);
    const earL = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.3, 6), bodyMat);
    earL.position.set(0.16, 1.2, -0.75);
    earL.rotation.x = -0.35;
    bolt.add(earL);
    const earR = earL.clone();
    earR.position.x = -0.16;
    bolt.add(earR);
    // Snout tip
    const snout = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xe8eef8, roughness: 0.5 })
    );
    snout.position.set(0, 0.72, -1.0);
    bolt.add(snout);
    // Cyan speed trail behind (+Z = toward camera)
    const trail = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 1.5, 8),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.5,
      })
    );
    trail.rotation.x = -Math.PI / 2;
    trail.position.set(0, 0.5, 0.95);
    bolt.add(trail);
    bolt.position.set(0, 0, 0);
    scene.add(bolt);

    // Track pieces
    const trackGroup = new THREE.Group();
    scene.add(trackGroup);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0c2840,
      emissive: 0x0a3a55,
      emissiveIntensity: 0.35,
      metalness: 0.65,
      roughness: 0.3,
    });
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.2,
    });

    type TrackPiece = {
      mesh: THREE.Group;
      z: number;
    };
    const pieces: TrackPiece[] = [];

    function makeSegment(z: number, curve = 0) {
      const g = new THREE.Group();
      const plate = new THREE.Mesh(
        new THREE.BoxGeometry(9, 0.35, SEGMENT_LEN - 0.4),
        platformMat
      );
      plate.position.y = -0.1;
      plate.receiveShadow = true;
      g.add(plate);
      // energy rails
      for (const x of [-4.3, 4.3]) {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.35, SEGMENT_LEN - 0.4),
          edgeMat
        );
        rail.position.set(x, 0.15, 0);
        g.add(rail);
      }
      // crystal pillars occasional
      if (Math.random() > 0.55) {
        const crystal = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.5 + Math.random() * 0.4, 0),
          new THREE.MeshStandardMaterial({
            color: 0x66e0ff,
            emissive: 0x1188aa,
            emissiveIntensity: 0.6,
            metalness: 0.8,
            roughness: 0.15,
            transparent: true,
            opacity: 0.85,
          })
        );
        crystal.position.set((Math.random() > 0.5 ? 1 : -1) * (5.2 + Math.random()), 1.2, (Math.random() - 0.5) * 4);
        g.add(crystal);
      }
      g.position.set(curve, 0, z);
      trackGroup.add(g);
      pieces.push({ mesh: g, z });
    }

    for (let i = 0; i < TRACK_SEGMENTS; i++) {
      makeSegment(-i * SEGMENT_LEN, Math.sin(i * 0.35) * 0.4);
    }

    // Orbs
    type Orb = { mesh: THREE.Mesh; collected: boolean; lane: number; z: number };
    const orbs: Orb[] = [];
    const orbGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xaefcff,
      emissive: 0x22d3ee,
      emissiveIntensity: 1.4,
      metalness: 0.9,
      roughness: 0.1,
    });

    function spawnOrb(z: number) {
      const lane = (Math.random() - 0.5) * 6;
      const mesh = new THREE.Mesh(orbGeo, orbMat.clone());
      mesh.position.set(lane, 1.1, z);
      scene.add(mesh);
      orbs.push({ mesh, collected: false, lane, z });
    }

    for (let i = 0; i < 28; i++) {
      spawnOrb(-18 - i * 9 - Math.random() * 4);
    }

    // Obstacles
    type Obstacle = { mesh: THREE.Mesh; lane: number; z: number; hit: boolean };
    const obstacles: Obstacle[] = [];
    const obsMat = new THREE.MeshStandardMaterial({
      color: 0xff4d8d,
      emissive: 0x880033,
      emissiveIntensity: 0.5,
      metalness: 0.4,
      roughness: 0.4,
    });

    for (let i = 0; i < 16; i++) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.4, 1.1), obsMat);
      const lane = (Math.random() - 0.5) * 5.5;
      const z = -30 - i * 16 - Math.random() * 6;
      mesh.position.set(lane, 0.7, z);
      mesh.castShadow = true;
      scene.add(mesh);
      obstacles.push({ mesh, lane, z, hit: false });
    }

    // Input
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") inputRef.current.left = down;
      if (e.code === "ArrowRight" || e.code === "KeyD") inputRef.current.right = down;
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        inputRef.current.jump = down;
        if (down) e.preventDefault();
      }
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    // Touch / pointer for mobile
    let pointerX: number | null = null;
    const onPointerDown = (e: PointerEvent) => {
      pointerX = e.clientX;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (pointerX == null) return;
      const dx = e.clientX - pointerX;
      if (dx < -12) {
        inputRef.current.left = true;
        inputRef.current.right = false;
      } else if (dx > 12) {
        inputRef.current.right = true;
        inputRef.current.left = false;
      }
    };
    const onPointerUp = () => {
      pointerX = null;
      inputRef.current.left = false;
      inputRef.current.right = false;
    };
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointerleave", onPointerUp);

    let boltX = 0;
    let boltY = 0;
    let velY = 0;
    let grounded = true;
    let worldZ = 0;
    let speedMul = 1;
    let hitSlow = 0;
    let last = performance.now();
    let running = true;
    let raceStarted = false;
    let timeLeft = DURATION;
    let orbsCollected = 0;
    let nextOrbZ = -280;

    // Wait for countdown via polling external state — use a ref set from outside
    const startTimeRef = { t: 0 };

    const clock = { elapsed: 0 };

    const animate = (now: number) => {
      if (!running) return;
      requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Sync start from countdown — parent sets data attribute
      const started = el.dataset.started === "1";
      if (started && !raceStarted) {
        raceStarted = true;
        startTimeRef.t = now;
      }
      if (!raceStarted) {
        camera.position.lerp(new THREE.Vector3(bolt.position.x * 0.3, 5.2, bolt.position.z + 11), 0.08);
        camera.lookAt(bolt.position.x, bolt.position.y + 1, bolt.position.z - 6);
        renderer.render(scene, camera);
        return;
      }

      clock.elapsed += dt;
      timeLeft = Math.max(0, DURATION - clock.elapsed);
      if (hitSlow > 0) hitSlow -= dt;

      const speed = FORWARD_SPEED * speedMul * (hitSlow > 0 ? 0.55 : 1);
      worldZ -= speed * dt;

      // Lateral move
      let targetX = boltX;
      if (inputRef.current.left) targetX -= 14 * dt;
      if (inputRef.current.right) targetX += 14 * dt;
      boltX = THREE.MathUtils.clamp(targetX, -LANE_LIMIT, LANE_LIMIT);

      // Jump
      if (inputRef.current.jump && grounded) {
        velY = 9.5;
        grounded = false;
        inputRef.current.jump = false;
      }
      velY -= 28 * dt;
      boltY += velY * dt;
      if (boltY <= 0) {
        boltY = 0;
        velY = 0;
        grounded = true;
      }

      bolt.position.set(boltX, boltY, 0);
      // Face down the track (−Z); bank slightly into strafe
      bolt.rotation.set(0, 0, -boltX * 0.06);
      // run bob
      bolt.position.y += Math.sin(clock.elapsed * 14) * 0.04 * (grounded ? 1 : 0);

      // Recycle track
      for (const p of pieces) {
        const localZ = p.z - worldZ;
        p.mesh.position.z = localZ;
        if (localZ > 20) {
          p.z -= TRACK_SEGMENTS * SEGMENT_LEN;
        }
      }

      // Orbs
      for (const o of orbs) {
        if (o.collected) continue;
        const lz = o.z - worldZ;
        o.mesh.position.z = lz;
        o.mesh.position.y = 1.1 + Math.sin(clock.elapsed * 4 + o.z) * 0.15;
        o.mesh.rotation.y += dt * 3;
        if (lz > 20) {
          o.z = nextOrbZ;
          nextOrbZ -= 10 + Math.random() * 6;
          o.lane = (Math.random() - 0.5) * 6;
          o.mesh.position.x = o.lane;
          o.collected = false;
          o.mesh.visible = true;
        }
        // collect
        if (Math.abs(lz) < 1.2 && Math.abs(o.lane - boltX) < 1.1 && boltY < 1.8) {
          o.collected = true;
          o.mesh.visible = false;
          orbsCollected += 1;
          speedMul = Math.min(1.35, speedMul + 0.02);
        }
      }

      // Obstacles
      for (const o of obstacles) {
        const lz = o.z - worldZ;
        o.mesh.position.z = lz;
        o.mesh.rotation.y += dt;
        if (lz > 20) {
          o.z -= 16 * 14;
          o.lane = (Math.random() - 0.5) * 5.5;
          o.mesh.position.x = o.lane;
          o.hit = false;
          o.mesh.visible = true;
        }
        if (
          !o.hit &&
          Math.abs(lz) < 1.1 &&
          Math.abs(o.lane - boltX) < 1.0 &&
          boltY < 1.3
        ) {
          o.hit = true;
          hitSlow = 1.1;
          speedMul = Math.max(0.85, speedMul - 0.08);
        }
      }

      // Camera follow
      const camTarget = new THREE.Vector3(boltX * 0.55, 4.8 + boltY * 0.3, 10.5);
      camera.position.lerp(camTarget, 0.1);
      camera.lookAt(boltX * 0.4, 1.2 + boltY * 0.4, -8);

      // Rim light follow
      rim.position.set(boltX, 3.5, -1);

      renderer.render(scene, camera);

      statsRef.current = { orbs: orbsCollected, timeLeft };
      // Update HUD ~4x / second
      if (Math.floor(clock.elapsed * 4) !== Math.floor((clock.elapsed - dt) * 4)) {
        setHud({
          orbs: orbsCollected,
          timeLeft: Math.ceil(timeLeft),
          speed: Math.round(speed * 3.6),
          started: true,
        });
      }

      if (orbsCollected >= TARGET_ORBS) {
        running = false;
        complete(orbsCollected, "goal");
      } else if (timeLeft <= 0) {
        running = false;
        complete(orbsCollected, "timeout");
      }
    };

    requestAnimationFrame(animate);

    const onResize = () => {
      if (!mountRef.current) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointerleave", onPointerUp);
      renderer.dispose();
      if (renderer.domElement.parentElement === el) {
        el.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          const m = obj.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m?.dispose();
        }
      });
    };
  }, [complete]);

  // Drive countdown → start flag on canvas host
  useEffect(() => {
    if (mountRef.current) {
      mountRef.current.dataset.started = countdown <= 0 ? "1" : "0";
    }
  }, [countdown]);

  return (
    <div className="sprint-quest">
      <div className="sprint-chrome">
        <button type="button" className="play-exit" onClick={() => navigate(-1)}>
          ← Exit
        </button>
        <div className="sprint-chrome-title">
          <span aria-hidden>{emoji}</span> {title}
        </div>
        <div className="sprint-chrome-stats">
          <span>⚡ {hud.orbs}/{TARGET_ORBS}</span>
          <span>⏱ {hud.started ? hud.timeLeft : DURATION}s</span>
        </div>
      </div>

      <div className="sprint-stage-wrap">
        <div ref={mountRef} className="sprint-canvas" />

        {countdown > 0 && (
          <div className="sprint-countdown">
            <p className="sprint-countdown-label">Stormgate Dash</p>
            <p className="sprint-countdown-num">{countdown}</p>
            <p className="sprint-countdown-hint">A / D or ← → · Space to jump · Swipe on mobile</p>
          </div>
        )}

        <div className="sprint-hud-bottom">
          <div className="sprint-bar-track">
            <i style={{ width: `${(hud.orbs / TARGET_ORBS) * 100}%` }} />
          </div>
          <p>
            Collect <strong>{TARGET_ORBS} Lightning Orbs</strong> · Speed{" "}
            {hud.started ? hud.speed : "—"} 
          </p>
        </div>
      </div>
    </div>
  );
}
