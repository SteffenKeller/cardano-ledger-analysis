# Cardano Ledger Analysis 

A front-end web application bootstrapped with [Next.js](https://nextjs.org/) that allows to track transactions and various activities on the Cardano blockchain. The tool provides insight into common activities on the Cardano blockchain, such as the simple transfer of ADA, the purchase of non-fungible tokens, or smart contract interactions, for example on decentralized exchanges. The data is retrieved from a [Cardano DB Sync](https://github.com/input-output-hk/cardano-db-sync) database, which requires a running [Cardano Node](https://github.com/input-output-hk/cardano-node). This project is the result of my bachelor thesis titled **Development of a tool for tracing Cardano transactions** at the *University of Lübeck*.

## Features

- **Transaction Info:** Displays relevant information about a transaction. This includes the time and date, the transaction hash, inputs and outputs, and the total value of the transfer. The page also includes a tree diagram that visualizes the previous transactions and their inputs to identify irregularities.

- **Address Info:** Displays relevant information about a payment address or stake address. This includes the current balance at that address, previous transactions, the total number of transactions, and the dates the address was first and last used.

- **Backtracking:** Starting with a transaction, it is possible to trace the path of the transaction inputs used in that transaction to find out where the funds originally came from.

- **Handle Tokens:** When gaining insight into a transaction or address, the tool does not only focus on the native currency ADA, but also handles non-fungible and fungible tokens that may be held by an address or moved between wallets.

- **Address Labeling:** The tool tags common addresses and smart contracts with a name to better understand the transaction context. 

- **Take notes:** The transaction view and address view feature a free text area where the user can enter notes during the analysis, which will be stored permanently throughout the session. 

## Getting Started

First, create a `.env.local` file and provide the necessary credentials to connect to your Cardano DB Sync database:

```bash
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_DATABASE=
DB_PORT=
```

Then, run the development server with:

```bash
npm run dev
```

Or start the producion server with: 

```bash
npm run build
npm run start 
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
