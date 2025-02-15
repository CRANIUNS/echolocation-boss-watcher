
import { useEffect, useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

const Index = () => {
  const [bossTimer, setBossTimer] = useState('');
  const [bossStatus, setBossStatus] = useState('');
  const [showMenu, setShowMenu] = useState(true);
  const [showEnemyLines, setShowEnemyLines] = useState(true);
  const [emoteSpamEnabled, setEmoteSpamEnabled] = useState(false);
  const [enemyLineColor, setEnemyLineColor] = useState('#ffff00');
  const [cloudTransparency, setCloudTransparency] = useState(0.5);
  const [swampTransparency, setSwampTransparency] = useState(1);
  const [bushTransparency, setBushTransparency] = useState(1);

  useEffect(() => {
    // Enable echolocation
    const enableEcholocation = () => {
      // @ts-ignore - visionType is a global variable from the game
      window.visionType = 1;
    };
    
    // Run echolocation continuously
    const echolocationInterval = setInterval(enableEcholocation, 0);

    // Boss timer update function
    const updateBossStatusAndTimer = () => {
      // Check if boss is alive (using querySelector as in original script)
      const bossIndicator = document.querySelector('.bC');
      
      if (bossIndicator) {
        setBossStatus("THE BOSS IS ALIVE");
        setBossTimer("");
      } else {
        // Calculate next boss time
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

    // Update boss timer every second
    const bossTimerInterval = setInterval(updateBossStatusAndTimer, 1000);

    // Handle keyboard events
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        setShowMenu(prev => !prev);
      } else if (event.key.toLowerCase() === 'c') {
        setShowEnemyLines(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Apply transparency effects
    const applyTransparency = () => {
      // @ts-ignore - game is a global variable
      if (typeof window.game !== 'undefined') {
        // @ts-ignore
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

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(echolocationInterval);
      clearInterval(bossTimerInterval);
      clearInterval(transparencyInterval);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [cloudTransparency, swampTransparency, bushTransparency]);

  return (
    <>
      {/* Boss Timer */}
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

      {/* ESP Mod Menu */}
      {showMenu && (
        <div className="fixed top-[10px] left-[10px] z-[9999] bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg w-[300px]">
          <h2 className="text-lg font-bold mb-4">ESP Mod Menu</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enemy Show</label>
              <Switch 
                checked={showEnemyLines}
                onCheckedChange={setShowEnemyLines}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Emote Spam</label>
              <Switch 
                checked={emoteSpamEnabled}
                onCheckedChange={setEmoteSpamEnabled}
              />
            </div>

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
      )}
    </>
  );
};

export default Index;
