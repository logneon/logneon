# ALPINE / 2091

A Three.js browser racing prototype set in an alpine sci-fi city. True 3D vehicle meshes, shadow lighting, an elevated highway, moving traffic, three laps, boost, synthesized engine audio, and a saved best lap.

Run `npm install` and `npm start`, then open http://localhost:5173. Requires a browser with WebGL 2 support.

W / Up accelerates, S / Down brakes, A / D or Left / Right steers. Hold Space to boost after 60 km/h. Escape pauses. Touch controls are available on small screens. Sound is optional. Complete three 6.4 km laps to finish the session.

Choose CAR, BIKE, TRUCK, or BUS before starting. All four also appear in traffic. Pause and choose CHANGE VEHICLE / RESTART to return to the selection screen.

Collision physics run at a fixed 120 Hz on the road plane: mass-weighted impulses, restitution, contact friction, overlap correction, and barrier rebounds. Vehicle size, acceleration, top speed, and grip vary. Impacts transfer momentum and trigger sparks, body shake, and camera shake. Traffic also collides with other traffic and brakes for obstacles.

Models are procedural meshes with wheels, glazing, lights, and distinct bodies; the bike includes a rider. This is arcade physics with axis-aligned collision bodies, not a full suspension, rollover, or vehicle deformation simulation. The skyline road is straight; the map represents lap progress rather than literal road geometry.

The environment includes a deep blue procedural sky, drifting cloud layers, sun glow, continuous snowy ridgelines, an animated turquoise lake, sailboats and piers, detailed glass towers, rooftop terraces, a landmark tower, and landscaped roadside trees, firs, hedges, and wildflowers. Vegetation uses instancing, and nearby scenery recycles as you drive. All scene textures are generated locally; no external image downloads are required.

`npm test` checks momentum, contact separation, lateral impacts, barriers, and high-speed collision detection. `npm run check` checks JavaScript syntax. Google Fonts are optional with local fallbacks.
