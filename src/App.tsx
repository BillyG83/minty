import { FormEvent, useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import mintyNFTs from './mintyNFTs'
import './App.css'

const Dapp = () => {
  // state and use effect should live at organism layer
  const { isConnected, address } = useAccount()
  const [isFetching, setIsFetching] = useState(false)
  const [owner, setOwner] = useState('')
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const isOwnerUi = Boolean(owner === walletAddress)
  
  const getOwner = async () => {
    try {
      const result = await mintyNFTs.methods.owner().call()
      return result
    } catch(error){
      console.error(error)
    }
  }

  useEffect(() => {
    address && setWalletAddress(address)
    getOwner().then(res => res && setOwner(String(res)))
  }, [address])

  const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
  const isValidEthereumAddress = (address: string) => ethereumAddressRegex.test(address);
  const addressInput = 'address-check'
  
  // submit processing should be at molecule layer
  const handleSubmit = async (e: FormEvent, isOwnerUi: boolean) => {
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
      if (isOwnerUi) {
        // add address to approved list
        await mintyNFTs.methods.addToApprovedList(input.value).call({
          from: address
        })
        // should be popMessage from a UI kit
        alert(`Nice, ${address} was added`)
      } else {
        // user is checking if they are approved
        const result = await mintyNFTs.methods.isAddressApproved(input.value).call()
        // should be popMessage from a UI kit
        alert(result ? 'Yep, you are in!' : 'Sorry, you are not on the list')
      }
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
        {/* should be talisman connect but docs are confusing */}
        <ConnectButton />
        <h1>Minty NFTs</h1>
      </header>
      
      {
        isConnected ? 
          <>
            {/* should be a child component on molecule layer with atom elements being called in */}
            <form onSubmit={(e) => handleSubmit(e, isOwnerUi)}>
                <label htmlFor={addressInput}>{isOwnerUi ? 'Add wallet address to approved list': 'Is your wallet address on the approved list?'}</label>
                <input 
                  autoComplete='true'
                  id={addressInput}
                  name={addressInput}
                  placeholder='enter your wallet address'
                  value={!isOwnerUi && walletAddress || undefined}
                  type='text'
                />
                <button disabled={isFetching} type="submit">{isFetching ? 'checking' : 'Enter'}</button>
            </form>
          </> 
        : <>
            <h2>Connect your wallet</h2>
          </>
      }
      {owner && <small>Contract Owner: {owner}</small>}
    </>
  )
}

export default Dapp
