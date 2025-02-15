
import { useEffect, useState } from 'react';

const Index = () => {
  const [bossTimer, setBossTimer] = useState('');
  const [bossStatus, setBossStatus] = useState('');

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

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(echolocationInterval);
      clearInterval(bossTimerInterval);
    };
  }, []);

  return (
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
  );
};

export default Index;
