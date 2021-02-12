# BCDV1011-escrow
## Design Patterns Lab 2

1. Spin up Ganache or ganache-cli -d (deterministric beacuse of hardcoded EOA and first contract deploy), and change "/express/index.js:3" from 8545 to 7545 if needed
2. Compile Escrow.sol with solc v0.7.1 and deploy
3. cd into "/express" and "npm i", then perform "node index"
4. cd into "/react" and "npm i", then perform "npm start"
5. If not auto-launched, navigate to http://localhost:3000
6. Deposit from '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0' to the Escrow
7. Make a payment from '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0' to '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b' within the Escrow's safe
8. Withdraw from the Escrow to '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b'
9. ETH was moved from 0xFFc...0f0 to 0x22d...32b within the safe and can now be withdrawn by 0x22d...32b
10. These steps could be invoked on command for trustless transfer from party A to party B