import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { FC, useEffect, useState } from "react"
import styles from "../styles/custom.module.css"

export const FetchNft: FC = () => {
  const [nftData, setNftData] = useState(null)

  const { connection } = useConnection()
  const wallet = useWallet()
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))

  // fetch nfts
  const fetchNfts = async () => {
    if (!wallet.connected) {
      return
    }

    // fetch NFTs for connected wallet
    const nfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: wallet.publicKey })
      .run()

    // fetch off chain metadata for each NFT
    let nftData = []
    for (let i = 0; i < nfts.length; i++) {
      let fetchResult = await fetch(nfts[i].uri)
      let json = await fetchResult.json()
      nftData.push(json)
    }

    // set state
    setNftData(nftData)
  }

  // fetch nfts when connected wallet changes
  useEffect(() => {
    fetchNfts()
  }, [wallet])

  return (
    <div>
      {nftData && (
        <div className={styles.gridNFT}>
          {nftData.map((nft) => (
            <div>
              {/* <ul>{nft.name}</ul>
              <img src={nft.image} /> */}
              <div className={styles.innerwrapper}>
                <div className={styles.content}>
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className={styles.imgnft}
                  />
                  <div className={styles.nftinfo}>
                    <div className={styles.nftinfoname}> {nft.name}  </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

{/* <div className="nft-card ">
      <div className="inner-wrapper">
        <div className="content">
          <img
            src={nft?.meta?.content[0]?.url}
            alt={nft?.meta?.name}
            className="imgnft"
          />
          <div className="nft-info">
            <div className="nft-info-l">
              <div className="nft-info-name">{nft?.meta?.name}</div>
              <p className="price-tag">
                {nft?.lastSale?.price}
                ETH
              
              </p>
            </div>
        
          </div>
        </div>
      </div>
    </div> */}