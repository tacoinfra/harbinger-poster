import {
  LogLevel,
  initOracleLib,
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
  enableZeroFees: boolean,
): Promise<string> {
  initOracleLib('debug')

  const store = await KmsKeyStore.from(awsKmsKeyId, awsRegion)
  const signer = new KmsSigner(awsKmsKeyId, awsRegion)

  let hash = ''
  if (signerUrl.includes('coinbase.com')) {
    const options = { apiKeyId, apiSecret, apiPassphrase }
    hash = await updateOracleFromFeedOnce(
      logLevel,
      oracleContractAddress,
      assetNames,
      store,
      signer,
      nodeURL,
      normalizerContractAddress,
      enableZeroFees,
      options,
    )
  } else {
    const options = { signerUrl }
    hash = await updateOracleFromFeedOnce(
      logLevel,
      oracleContractAddress,
      assetNames,
      store,
      signer,
      nodeURL,
      normalizerContractAddress,
      enableZeroFees,
      options,
    )
  }

  return hash
}
