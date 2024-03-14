import { FormEvent, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import mintyNFTs from './mintyNFTs'
import './App.css'

const Dapp = () => {
  const [isFetching, setIsFetching] = useState(false)

  const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
  const isValidEthereumAddress = (address: string) => ethereumAddressRegex.test(address);
  const addressInput = 'address-check'
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem(addressInput) as HTMLInputElement;

    if (!isValidEthereumAddress(input.value)) {
      // should be popMessage from a UI kit
      alert(`Sorry! ${input.value} does not appear to be a Ethereum wallet address`)
      return
    }

    try {
      // isFetching should provide better UX than disabled button
      setIsFetching(true)
      const result = await mintyNFTs.methods.isAddressApproved(input.value).call()
      // should be popMessage from a UI kit
      alert(result ? 'Yep, you are in!' : 'Sorry, you are not on the list')
    } catch (error) {
      // should be popMessage from a UI kit
      alert(`Hmmmm, we were unable to check address: ${input.value}`)
      console.error(error)
    }
    setIsFetching(false)
    form.reset()
  }

  return (
    <>
      <header>
        <ConnectButton />
        <h1>Minty NFTs</h1>
      </header>
      
      <form onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor={addressInput}>Is your wallet address on the whitelist?</label>
          <input 
            autoComplete='true'
            id={addressInput}
            name={addressInput}
            placeholder='enter your wallet address'
            type='text'
          />
          <button disabled={isFetching} type="submit">{isFetching ? 'checking' : 'Enter'}</button>
      </form>
    </>
  )
}

export default Dapp
