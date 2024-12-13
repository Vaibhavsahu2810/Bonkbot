import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { SystemProgram, PublicKey, Connection} from '@solana/web3.js'


const connection = new Connection('https://api.devnet.solana.com');
const fromPubkey = new PublicKey("8XPovF32Ya1aJcoxbJLNrNGToRwvAQMzkTuQY81pk857")


function App() {
  const [amount, setAmount] = useState(0)
  const [address, setAddress] = useState('')


  const sendSol = async () => {
    console.log(amount, address);
    const ix = SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey: new PublicKey(address),
      lamports: amount,
    })
    const tx = await connection.sendTransaction(new Transaction().add(ix));
    console.log(tx);

    const {blockhash} = await connection.getRecentBlockhash();
    console.log(blockhash);
    tx.recentBlockhash = blockhash;
    tx.feePayer = fromPubkey;

    const serializedTx = tx.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    })

    console.log(serializedTx);

    await axios.post("http://localhost:3000/api/v1/txn/sign", {
      message: serializedTx,
      retry : false 
    })
    
  }
 return (
  <div>
    <input 
    type="text" 
    placeholder="Amount" 
    value={amount} 
    onChange={(e) => setAmount(e.target.value)} 
    />
    <input 
    type="text" 
    placeholder="Address" 
    value={address} 
    onChange={(e) => setAddress(e.target.value)} 
    />
    <button onClick={sendSol}>Submit</button>
  </div>
  )
}

export default App

import { Buffer } from 'buffer';
import process from 'process';

window.Buffer = Buffer;
window.process = process;

