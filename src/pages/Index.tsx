import { useEffect, useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

const Index = () => {
  const [bossTimer, setBossTimer] = useState('');
  const [bossStatus, setBossStatus] = useState('');
  const [showMenu, setShowMenu] = useState(true);
  const [showBossTimer, setShowBossTimer] = useState(true);
  const [showEnemyLines, setShowEnemyLines] = useState(true);
  const [emoteSpamEnabled, setEmoteSpamEnabled] = useState(false);
  const [enemyLineColor, setEnemyLineColor] = useState('#ffff00');
  const [cloudTransparency, setCloudTransparency] = useState(0.5);
  const [swampTransparency, setSwampTransparency] = useState(1);
  const [bushTransparency, setBushTransparency] = useState(1);
  const [viewDirection, setViewDirection] = useState('normal');
  const [instantRespawn, setInstantRespawn] = useState(false);
  const [smoothMovement, setSmoothMovement] = useState(false);
  const [showHealthTable, setShowHealthTable] = useState(false);
  const [expBonus, setExpBonus] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(1000);
  const [canvasHeight, setCanvasHeight] = useState(1000);
  const [showLowHealthWarning, setShowLowHealthWarning] = useState(false);
  const [currentHealth, setCurrentHealth] = useState(100);

  useEffect(() => {
    const enableEcholocation = () => {
      window.visionType = 1;
    };

    const echolocationInterval = setInterval(enableEcholocation, 0);

    const updateBossStatusAndTimer = () => {
      const bossIndicator = document.querySelector('.bC');
      
      if (bossIndicator) {
        setBossStatus("THE BOSS IS ALIVE");
        setBossTimer("");
      } else {
        const currentTime = new Date();
        const nextBossTime = new Date(currentTime);
        nextBossTime.setHours(currentTime.getHours() + 1);
        nextBossTime.setMinutes(0);
        nextBossTime.setSeconds(0);

        const timeDifference = nextBossTime.getTime() - currentTime.getTime();
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setBossStatus("");
        setBossTimer(`Boss Timer: ${formattedTime}`);
      }
    };

    const bossTimerInterval = setInterval(updateBossStatusAndTimer, 1000);

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        setShowMenu(prev => !prev);
      } else if (event.key.toLowerCase() === 'c') {
        setShowEnemyLines(prev => !prev);
      } else if (event.key.toLowerCase() === 'y') {
        setShowMenu(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    const updateViewDirection = () => {
      if (typeof window.game !== 'undefined' && window.game.me) {
        const offset = viewDirection === 'normal' ? 0 : 200;
        window.game.me.getAllPositions = function() {
          return {
            x: this.position.x,
            y: this.position.y,
            center: {
              x: this.position.x + this.width + (viewDirection === 'right' ? offset : viewDirection === 'left' ? -offset : 0),
              y: this.position.y + this.height + (viewDirection === 'top' ? offset : viewDirection === 'bottom' ? -offset : 0)
            },
            right: this.position.x + this.width,
            left: this.position.x,
            top: this.position.y + this.height,
            bottom: this.position.y
          };
        };
      }
    };

    const viewInterval = setInterval(updateViewDirection, 100);

    const applyTransparency = () => {
      if (typeof window.game !== 'undefined') {
        Object.values(window.game.gameObjects).forEach((obj: any) => {
          if (obj.name.includes('cloud')) {
            obj.opacity = cloudTransparency;
          } else if (obj.name === 'swamp') {
            obj.opacity = swampTransparency;
          } else if (obj.name.includes('bush')) {
            obj.opacity = bushTransparency;
          }
        });
      }
    };

    const transparencyInterval = setInterval(applyTransparency, 100);

    const healthInterval = setInterval(() => {
      if (typeof window.game !== 'undefined' && window.game.me) {
        const health = window.game.me.hp;
        setCurrentHealth(health);
        setShowLowHealthWarning(health <= 20);
      }
    }, 100);

    const gameFeatures = setInterval(() => {
      if (typeof window.game !== 'undefined') {
        if (instantRespawn && window.imDead) {
          window.playAgain();
        }

        if (window.game.maxInterpolateDistanceTeleport) {
          window.game.maxInterpolateDistanceTeleport = smoothMovement ? 3000 : 300;
        }

        if (typeof window.startBonus !== 'undefined') {
          window.startBonus = expBonus;
        }

        if (window.game.canvas) {
          window.game.canvas.width = canvasWidth;
          window.game.canvas.height = canvasHeight;
        }
      }
    }, 100);

    return () => {
      clearInterval(echolocationInterval);
      clearInterval(bossTimerInterval);
      clearInterval(transparencyInterval);
      clearInterval(viewInterval);
      clearInterval(healthInterval);
      clearInterval(gameFeatures);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [cloudTransparency, swampTransparency, bushTransparency, viewDirection, 
      instantRespawn, smoothMovement, expBonus, canvasWidth, canvasHeight]);

  const goToLocation = (location: 'swamp' | 'desert' | 'middle') => {
    if (typeof window.game !== 'undefined' && window.game.camera) {
      const positions = {
        swamp: { x: 32120.979428936298, y: 2320.449999981 },
        desert: { x: 81924.5164619628, y: 2320.449999984 },
        middle: { x: 54778.322855249105, y: 2358.94311498326 }
      };
      window.game.camera.position = positions[location];
    }
  };

  const disableCanvasResize = () => {
    if (typeof window.game !== 'undefined') {
      window.game.setCanvasSize = function() {};
    }
  };

  return (
    <>
      {showBossTimer && (
        <div className="fixed top-[50px] right-[10px] z-[9999] flex items-center bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <img 
            src="https://cdn1.na.evoworld.io/sprites/bosses/boss1/flying/1.png"
            alt="Boss"
            className="w-[50px] h-[50px] mr-4 object-contain"
          />
          <div className="flex flex-col">
            {bossStatus && (
              <div className="text-lg font-semibold text-red-600">
                {bossStatus}
              </div>
            )}
            {bossTimer && (
              <div className="text-lg font-semibold text-gray-800">
                {bossTimer}
              </div>
            )}
          </div>
        </div>
      )}

      {showLowHealthWarning && showHealthTable && (
        <div className="fixed bottom-4 left-4 z-[9999] bg-red-500 text-white px-6 py-3 rounded-lg font-bold animate-pulse">
          LOW HEALTH WARNING!
        </div>
      )}

      {showHealthTable && (
        <div className="fixed top-1/2 right-4 z-[9999] bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="text-2xl font-bold">
            HP: {currentHealth}
          </div>
        </div>
      )}

      {showMenu && (
        <div className="fixed top-[10px] left-[10px] z-[9999] bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg w-[300px]">
          <h2 className="text-lg font-bold mb-4">ESP Mod Menu</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide">General Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show Boss Timer</label>
                  <Switch checked={showBossTimer} onCheckedChange={setShowBossTimer} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Enemy Show</label>
                  <Switch checked={showEnemyLines} onCheckedChange={setShowEnemyLines} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Emote Spam</label>
                  <Switch checked={emoteSpamEnabled} onCheckedChange={setEmoteSpamEnabled} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide">Game Enhancements</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Instant Respawn</label>
                  <Switch checked={instantRespawn} onCheckedChange={setInstantRespawn} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Smooth Movement</label>
                  <Switch checked={smoothMovement} onCheckedChange={setSmoothMovement} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show Health</label>
                  <Switch checked={showHealthTable} onCheckedChange={setShowHealthTable} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">30% EXP Bonus</label>
                  <Switch checked={expBonus} onCheckedChange={setExpBonus} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide">View Direction</h3>
              <div className="grid grid-cols-2 gap-2">
                {['normal', 'right', 'left', 'top', 'bottom'].map((direction) => (
                  <button
                    key={direction}
                    onClick={() => handleViewChange(direction)}
                    className={`px-3 py-2 text-sm border-2 border-black rounded capitalize
                      ${viewDirection === direction ? 'bg-black text-white' : 'bg-white text-black'}`}
                  >
                    {direction} view
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide">Quick Teleport</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => goToLocation('swamp')}
                  className="px-3 py-2 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600"
                >
                  Swamp
                </button>
                <button
                  onClick={() => goToLocation('desert')}
                  className="px-3 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Desert
                </button>
                <button
                  onClick={() => goToLocation('middle')}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Middle
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide">Transparency</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cloud Transparency</label>
                  <Slider
                    value={[cloudTransparency]}
                    onValueChange={([value]) => setCloudTransparency(value)}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Swamp Transparency</label>
                  <Slider
                    value={[swampTransparency]}
                    onValueChange={([value]) => setSwampTransparency(value)}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bush Transparency</label>
                  <Slider
                    value={[bushTransparency]}
                    onValueChange={([value]) => setBushTransparency(value)}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide">Canvas Settings</h3>
              <button
                onClick={disableCanvasResize}
                className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Disable Canvas Resize
              </button>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Canvas Width</label>
                  <Slider
                    value={[canvasWidth]}
                    onValueChange={([value]) => setCanvasWidth(value)}
                    min={1}
                    max={5100}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Canvas Height</label>
                  <Slider
                    value={[canvasHeight]}
                    onValueChange={([value]) => setCanvasHeight(value)}
                    min={1}
                    max={5100}
                    step={1}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide">Style</h3>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enemy Line Color</label>
                <input
                  type="color"
                  value={enemyLineColor}
                  onChange={(e) => setEnemyLineColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
