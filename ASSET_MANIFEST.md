# Apex Group 3D Asset Manifest

This application uses a **single persistent WebGL `<Canvas>`** powered by `src/experience/models/assetRegistry.ts`.
At present, all five industrial business assets (plus scene-specific mechanical/architectural reveals) render via **multi-part procedural PBR development placeholders** so the experience runs cleanly offline with zero broken network requests.

## Business Assets (GLB Swap Paths)

| Asset ID | Business Division | Target `.glb` Path | Required Nodes |
| :--- | :--- | :--- | :--- |
| `tanker` | Apex Road Lines | `/public/assets/models/apex-tanker-truck.glb` | `cab_body`, `tank_barrel`, `chassis_frame`, `wheel_0..5`, `headlights`, `taillights`, `brakelights`, `indicators` |
| `biofuel` | Apex Bio Fuel India Pvt. Ltd. | `/public/assets/models/apex-biofuel-vessel.glb` | `reactor_vessel`, `cyclone_hopper`, `feed_manifold`, `return_manifold`, `pressure_gauge` |
| `drum` | Pranar Oils & Chemicals | `/public/assets/models/pranar-oil-drum.glb` | `drum_shell`, `rolling_hoop_lower`, `rolling_hoop_upper`, `top_clamp_ring`, `bung_plug_large`, `bung_plug_small` |
| `canister` | Apex Natural Lubes & Chemicals FZCO | `/public/assets/models/apex-lubricant-canister.glb` | `canister_body`, `pour_neck`, `screw_cap`, `neck_seal`, `sight_strip`, `front_label`, `back_label` |
| `dispenser` | JS Fuels | `/public/assets/models/js-fuel-dispenser.glb` | `column_housing`, `display_front`, `display_back`, `hose_left`, `hose_right`, `nozzle_left`, `nozzle_right` |

## Companion Procedural Effects & Architectural Props

- **Oil Droplets (`src/experience/models/OilDropletsEffect.tsx`)**: Instanced viscous golden droplets orbiting the Pranar steel drum in Section 07.
- **Mechanical Engine Assembly (`src/experience/models/EngineAssemblyModel.tsx`)**: Meshing gears and reciprocating piston assembly accompanying the Natural Lubes canister in Section 09.
- **Forecourt Canopy (`src/experience/models/FuelStationModel.tsx`)**: Architectural multi-fuel station canopy displaying `PETROL · DIESEL · CNG · LPG` around the JS Fuels dispenser in Section 11.

## Replacing Placeholders with Production `.glb` Files

1. Export Draco-compressed or standard `.glb` models using bottom-center pivot alignment (`Y = 0` at ground contact).
2. Place files in `/public/assets/models/` matching the `glbPath` paths above.
3. Update `sourceMode` from `'procedural-placeholder'` to `'glb'` in `src/experience/models/assetRegistry.ts` and invoke `loadNormalizedGLBAsset(...)`.
