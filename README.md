# Exercise D: Rock, Paper, Scissor, Lizard, Spock

This is the submission for exercise D. I have developed a Decentralized Application (Dapp) that enables users to play Rock, Paper, Scissors, Lizard, Spock. Users interact with the Dapp by staking ETH, with the challenging player initiating the game by creating a contract. This contract serves as the main point of interaction. The stake is claimed entirely by the winning player.

## Technologies

- Typescript
- Next.js
- ShadCn/ui
- wagmi
- viem
- zod
- upstash
- react-hook-form
- redis

## Tech Reasons

This Dapp was built with TypeScript, my preferred programming language, providing essential type-specificity. I utilized the wagmi library, well-regarded for its useful React hooks, which simplified wallet connections and contract interactions. Viem, a lightweight, composable, and type-safe library, was incorporated to further enhance the development process. Although I usually lean towards ethers.js, Viem was used here to demonstrate its versatility in a Dapp context. Integrating Viem into wagmi ensured an efficient development process. For a more detailed comparison of the two libraries, refer to: [Viem vs Ethers.js](https://viem.sh/docs/introduction.html)

## Security and Salt handling

The Dapp contract offers strong defense against potential threats, such as front-running and inadequate function checks. Frontend security also required careful consideration, particularly to prevent salt guessing. If Player 1 uses a simple or predictable salt in the commitment scheme, Player 2 could potentially guess it and determine Player 1's move. To prevent this, I implemented a salt generation function using the crypto and Viem libraries to create a complex, unpredictable salt.

The selected move and corresponding salt are stored in local storage tied to the game contract, and are utilized during the reveal phase. I considered introducing a password encryption system for local storage values during contract creation and decryption during the reveal phase for additional security.

The current approach exposes certain risks, such as physical access to the user's device or malware attacks. Ideally, the salt and move would be stored on a separate smart contract, enabling the game contract to reference the storage contract, maintaining the Dapp's fully decentralized nature.

## Notes

A basic Redis database is used in this project to track games associated with each connected player's address. Although not explicitly required, it greatly improves the gameplay experience, allowing for simultaneous multi-game execution.

 While real-time game feed was considered, it wasn't implemented due to project scope. This feature would have been simpler with event functionalities in the contract. To ensure game updates, a polling mechanism was introduced via useEffect for each game. Users will need to refresh the page when a new contract is created.

I made efforts to improve the UI/UX to keep users informed about their blockchain interactions. Basic toast notifications are in place, and future updates could include stylized buttons for enhanced user experience. This project offers a snapshot of my capabilities, and future exercises will provide further opportunities to showcase these skills.

## Mixed Strategy Nash Equilibria

In the conventional Rock, Paper, Scissors game, the mixed strategy involves distributing a player's set of pure strategies. The Nash equilibrium for this game suggests each player should select a move with equal probability (1/3).

In my Dapp version of Rock, Paper, Scissors, Lizard, Spock, each action can defeat or be defeated by two other actions. The symmetry suggests that the mixed Nash equilibrium involves each player choosing a move with equal probability (1/5 for each move).

The mixed strategy Nash equilibrium is optimal, as no advantage is gained by deviating from it. However, research from Zhejiang University in China found a unique pattern in player choices during Rock, Paper, Scissors gameplay. Players selected each strategy roughly one-third of the time, seemingly validating the Nash Equilibrium theory.

Upon closer inspection, a different pattern emerged: winners often repeated their successful strategy, while losers moved to the next strategy in sequence. Referred to as a 'conditional response' in game theory, this behavior might be hard-wired into the brain. Further research is needed to validate this intriguing hypothesis.
