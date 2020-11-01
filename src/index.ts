import {
  LogLevel,
  initOracleLib,
  updateOracleFromCoinbaseOnce,
  updateOracleFromFeedOnce,
} from '@tacoinfra/harbinger-lib'
import { KmsKeyStore, KmsSigner } from '@tacoinfra/conseil-kms'

const logLevel = LogLevel.Debug

export default async function main(
  oracleContractAddress: string,
  signerUrl: string,
  awsKmsKeyId: string,
  awsRegion: string,
  nodeURL: string,
  apiKeyId: string,
  apiSecret: string,
  apiPassphrase: string,
  assetNames: Array<string>,
  normalizerContractAddress: string | undefined,
  enableZeroFees: boolean
): Promise<string> {
  initOracleLib('debug')

  const store = await KmsKeyStore.from(awsKmsKeyId, awsRegion)
  const signer = new KmsSigner(awsKmsKeyId, awsRegion)

  let hash = ''
  if (signerUrl.includes('coinbase.com')) {
    hash = await updateOracleFromCoinbaseOnce(
      logLevel,
      apiKeyId,
      apiSecret,
      apiPassphrase,
      oracleContractAddress,
      assetNames,
      store,
      signer,
      nodeURL,
      normalizerContractAddress,
      enableZeroFees
    )
  } else {
    hash = await updateOracleFromFeedOnce(
      logLevel,
      signerUrl,
      oracleContractAddress,
      assetNames,
      store,
      signer,
      nodeURL,
      normalizerContractAddress,
      enableZeroFees
    )
  }

  return hash
}
