/* GameGuy curriculum: single source of truth for nav, sidebars and prev/next. */
window.GG_TRACKS = [
  {
    id: "brutal", title: "BRUTAL Framework", short: "BRUTAL", color: "var(--c-brutal)", icon: "▣",
    blurb: "Learn the open-source C# framework behind RimWorld's Waylith engine and Kitten Space Agency, from your first window to a shipped pixel game.",
    lessons: [
      ["what-is-brutal", "What BRUTAL is (and isn't)"],
      ["setup", "Setup: .NET 10, GPU & samples"],
      ["first-window", "Your first window with GLFW"],
      ["packages", "Tour of the packages"],
      ["foundations", "Foundations: Core, Memory, Collections, Strings"],
      ["game-loop", "Building a real game loop"],
      ["sdl-2d", "Pixel-perfect 2D with SDL"],
      ["opengl", "Drawing with OpenGL"],
      ["imgui", "Debug UI with Dear ImGui"],
      ["physics", "2D physics with Box2D"],
      ["audio", "Sound with OpenAL"],
      ["capstone", "Capstone: Coin Dash (a tiny pixel game)"],
      ["shipping", "Shipping: license, credits & builds"]
    ]
  },
  {
    id: "csharp", title: "C# for Game Developers", short: "C#", color: "var(--c-csharp)", icon: "#",
    blurb: "The C# you actually need for games and frameworks: value types, events, Span<T>, unsafe code and native interop.",
    lessons: [
      ["why-csharp", "Why C# for games?"],
      ["setup", "Install .NET 10 & run file-based apps"],
      ["basics", "Variables, types & control flow"],
      ["classes-structs", "Classes, structs & records"],
      ["collections", "Arrays, lists, dictionaries & Span"],
      ["interfaces-generics", "Interfaces, generics & inheritance"],
      ["delegates-events", "Delegates, lambdas & events"],
      ["memory", "The GC & zero-allocation gameplay"],
      ["disposal", "IDisposable, using & resource lifetime"],
      ["unsafe-interop", "Unsafe code, pointers & native interop"]
    ]
  },
  {
    id: "enginedev", title: "Engine & Framework Development", short: "Engine Dev", color: "var(--c-engine)", icon: "⚙",
    blurb: "How engines are built: loops, platform layers, entities, renderers, assets and tools. You finish with a mini engine on BRUTAL.",
    lessons: [
      ["engine-vs-framework", "Engine vs framework vs library"],
      ["architecture", "Engine architecture in layers"],
      ["main-loop", "The main loop & fixed timestep"],
      ["platform-input", "Platform layer & input mapping"],
      ["entities", "Entities: OOP, components & ECS"],
      ["rendering-2d", "2D rendering: sprites, batches & cameras"],
      ["assets", "Asset pipeline & resource handles"],
      ["scenes", "Scenes & state stacks"],
      ["physics-audio", "Integrating physics & audio"],
      ["tooling", "Tooling: logging, debug UI & profiling"],
      ["mini-engine", "Project: build a mini engine on BRUTAL"]
    ]
  },
  {
    id: "design", title: "Game Design", short: "Design", color: "var(--c-design)", icon: "◆",
    blurb: "Core loops, MDA, game feel, level design, balancing and playtesting: the craft of making play worth having.",
    lessons: [
      ["core-loop", "Core loops & player goals"],
      ["mda", "The MDA framework"],
      ["game-feel", "Game feel & juice"],
      ["level-design", "Level design fundamentals"],
      ["balancing", "Difficulty & balancing"],
      ["playtesting", "Prototyping & playtesting"]
    ]
  },
  {
    id: "pixel", title: "Pixel Art", short: "Pixel Art", color: "var(--c-pixel)", icon: "▦",
    blurb: "Canvas sizes, palettes, clean lines, shading, animation and tiles, plus a pixel editor that runs in your browser.",
    lessons: [
      ["canvas-palette", "Canvas size & palettes"],
      ["lines-clusters", "Lines, clusters & readability"],
      ["shading", "Shading, dithering & anti-aliasing"],
      ["animation", "Sprite animation"],
      ["tiles", "Tiles & tilesets"],
      ["editor", "Pixel editor (tool)"]
    ]
  },
  {
    id: "engines", title: "Other Engines", short: "Engines", color: "var(--c-engines)", icon: "◎",
    blurb: "Godot, Unity and GameMaker: how they compare with BRUTAL and when to pick each.",
    lessons: [
      ["godot", "Godot"],
      ["unity", "Unity"],
      ["gamemaker", "GameMaker"],
      ["choosing", "Choosing: engine or framework?"]
    ]
  }
];
