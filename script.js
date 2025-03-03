 // ----------------------------------
    // 1) Start Screen / Initialization
    // ----------------------------------

    // Start button functionality
    document.getElementById('startBtn').addEventListener('click', () => {
        document.getElementById('startScreen').style.display = 'none';
        document.querySelector('.container').style.display = 'flex';
        document.getElementById('moves').style.display = 'flex';
        updateBars();
      });
  
      // Initial Stats
      let playerHealth = 250, computerHealth = 250;
      let playerEnergy = 200, computerEnergy = 200;
  
      const playerHealthBar   = document.getElementById('playerHealthBar');
      const computerHealthBar = document.getElementById('computerHealthBar');
      const playerEnergyBar   = document.getElementById('playerEnergyBar');
      const computerEnergyBar = document.getElementById('computerEnergyBar');
  
      const bankaiBtn = document.getElementById('bankaiBtn');
  
      // ----------------------------------
      // 2) Utility Functions
      // ----------------------------------
  
      // Update the health and energy bars
      function updateBars() {
        playerHealthBar.style.width   = (playerHealth   / 250 * 100) + '%';
        computerHealthBar.style.width = (computerHealth / 250 * 100) + '%';
        playerEnergyBar.style.width   = (playerEnergy   / 200 * 100) + '%';
        computerEnergyBar.style.width = (computerEnergy / 200 * 100) + '%';
  
        // Reveal Bankai button if health < 150
        if (playerHealth < 150) {
          bankaiBtn.style.display = 'inline-block';
        }
      }
  
      // Simple random chance helper
      function randomChance(percent) {
        return Math.random() * 100 < percent;
      }
  
      // Check if game is over
      function checkGameOver() {
        if (playerHealth <= 0 || computerHealth <= 0) {
          alert(playerHealth <= 0 ? 'Computer wins!' : 'Main Player wins!');
          // Disable all buttons
          document.querySelectorAll('button').forEach(btn => btn.disabled = true);
        }
      }
  
      // Computer move: chooses a fire attack (35 damage) if it has enough energy
      function computerMove() {
        if (computerEnergy < 20) return; // no move if not enough energy
        computerEnergy -= 20;
        updateBars();
        setTimeout(() => {
          playerHealth = Math.max(playerHealth - 35, 0);
          updateBars();
          checkGameOver();
        }, 500);
      }
  
      // Show an act title overlay for 3 seconds, then call `nextStep`
      function showActTitle(title, nextStep) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.7)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.fontSize = '32px';
        overlay.style.fontWeight = 'bold';
        overlay.style.zIndex = '9999';
        overlay.textContent = title;
  
        document.body.appendChild(overlay);
  
        // Remove after 3 seconds
        setTimeout(() => {
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }
          if (nextStep) nextStep();
        }, 3000);
      }
  
      // ----------------------------------
      // 3) Player Moves
      // ----------------------------------
  
      // Kageoni
      document.getElementById('kageoniBtn').addEventListener('click', () => {
        if (playerEnergy < 20) {
          alert("Not enough energy!");
          return;
        }
        playerEnergy -= 20;
        updateBars();
  
        const isCritical = randomChance(20);
        const damage = isCritical ? 50 : 25;
  
        const computerElem = document.getElementById('computer');
        const sword = document.createElement('div');
        sword.classList.add('kageoni-effect');
        sword.innerText = '🗡️';
        computerElem.appendChild(sword);
  
        setTimeout(() => {
          if (computerElem.contains(sword)) {
            computerElem.removeChild(sword);
          }
        }, 800);
  
        setTimeout(() => {
          computerHealth = Math.max(computerHealth - damage, 0);
          updateBars();
          checkGameOver();
          setTimeout(computerMove, 1000);
        }, 500);
      });
  
      // Rock Paper Scissors
      document.getElementById('rpsBtn').addEventListener('click', () => {
        if (playerEnergy < 30) {
          alert("Not enough energy!");
          return;
        }
        playerEnergy -= 30;
        updateBars();
  
        const choices = ['rock', 'paper', 'scissors'];
        const playerChoice = prompt("Choose Rock, Paper, or Scissors").toLowerCase();
        if (!choices.includes(playerChoice)) {
          alert("Invalid choice!");
          return;
        }
  
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
        alert("Computer chose " + computerChoice);
  
        if (playerChoice === computerChoice) {
          alert("It's a tie! No damage dealt.");
        } else if (
          (playerChoice === 'rock' && computerChoice === 'scissors') ||
          (playerChoice === 'scissors' && computerChoice === 'paper') ||
          (playerChoice === 'paper' && computerChoice === 'rock')
        ) {
          computerHealth = Math.max(computerHealth - 75, 0);
          alert("You win! Computer takes 75 damage.");
        } else {
          playerHealth = Math.max(playerHealth - 75, 0);
          alert("You lose! You take 75 damage.");
        }
  
        updateBars();
        checkGameOver();
        setTimeout(computerMove, 1000);
      });
  
      // ----------------------------------
      // 4) Bankai Sequence
      // ----------------------------------
  
      // Break each act into a separate function
      function doAct1() {
        // Act 1: Shared damage (each loses 20 HP) + red flash
        playerHealth   = Math.max(playerHealth   - 20, 0);
        computerHealth = Math.max(computerHealth - 20, 0);
        updateBars();
  
        const effects = document.getElementById('bankaiEffects');
        const flash   = document.createElement('div');
        flash.classList.add('flash');
        effects.appendChild(flash);
  
        setTimeout(() => {
          if (effects.contains(flash)) effects.removeChild(flash);
        }, 500);
      }
  
      function doAct2() {
        // Act 2: Dripping hole effect on the computer
        const computerElem = document.getElementById('computer');
        const hole = document.createElement('div');
        hole.classList.add('hole');
        computerElem.appendChild(hole);
  
        setTimeout(() => {
          if (computerElem.contains(hole)) computerElem.removeChild(hole);
        }, 2000);
      }
  
      function doAct3() {
        // Act 3: Underwater effect + energy drain for 3s
        document.getElementById('mainPlayer').classList.add('underwater');
        document.getElementById('computer').classList.add('underwater');
  
        let drainInterval = setInterval(() => {
          if (playerEnergy   > 0) playerEnergy   = Math.max(playerEnergy   - 5, 0);
          if (computerEnergy > 0) computerEnergy = Math.max(computerEnergy - 5, 0);
          updateBars();
        }, 500);
  
        // Remove underwater effect after 3 seconds
        setTimeout(() => {
          clearInterval(drainInterval);
          document.getElementById('mainPlayer').classList.remove('underwater');
          document.getElementById('computer').classList.remove('underwater');
        }, 3000);
      }
  
      function doAct4() {
        // Act 4: String across screen + curtains + 200 damage
        const stringEl = document.createElement('div');
        stringEl.classList.add('string');
        stringEl.innerText = '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------';
        document.body.appendChild(stringEl);
  
        // After 3s, show curtains, then deal 200 damage
        setTimeout(() => {
          const curtainLeft  = document.createElement('div');
          curtainLeft.classList.add('curtain', 'left');
          const curtainRight = document.createElement('div');
          curtainRight.classList.add('curtain', 'right');
          document.body.appendChild(curtainLeft);
          document.body.appendChild(curtainRight);
  
          // Deal 200 damage to the computer
          computerHealth = Math.max(computerHealth - 200, 0);
          updateBars();
  
          // Remove the string text after 5s
          setTimeout(() => {
            if (document.body.contains(stringEl)) {
              document.body.removeChild(stringEl);
            }
          }, 5000);
        }, 3000);
  
        // After Act 4 finishes, check game over and let computer move
        setTimeout(() => {
          checkGameOver();
          setTimeout(computerMove, 1000);
        }, 8000);
      }
  
      // Bankai button: sequence of 4 acts, each preceded by a 3-second overlay
      bankaiBtn.addEventListener('click', () => {
        if (playerEnergy < 50) {
          alert("Not enough energy for Bankai!");
          return;
        }
        playerEnergy -= 50;
        updateBars();
  
        // Show Act 1 title, then do Act 1
        showActTitle("Act 1: Ichidanme: Tameraikizu no Wakachiai", () => {
          doAct1();
  
          // Show Act 2 title, then do Act 2
          showActTitle("Act 2: Zanki No Shitone", () => {
            doAct2();
  
            // Show Act 3 title, then do Act 3
            showActTitle("Act 3: Dangyo No Fuchi", () => {
              doAct3();
  
              // Show final act title, then do Act 4
              showActTitle("With That I Present To You The Final Act: Itokiribasami Chizome", () => {
                doAct4();
              });
            });
          });
        });
      });